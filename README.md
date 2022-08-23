# backstage-plugin-scaffolder-git-actions package

This is a `git` actions plugin for the `scaffolder-backend` in Backstage.

This contains a collection of actions for using with git:

- git
- git:clone

## Prerequisites
- Git must be installed in the environment your Backstage instance is running in

## Getting started

In the root directory of your Backstage project:

```
yarn add --cwd packages/backend @mdude2314/backstage-plugin-scaffolder-git-actions
```

Add the actions you'd like to the scaffolder:

```typescript
// packages/backend/src/plugins/scaffolder.ts

import { gitCloneAction, gitAction } from "@mdude2314/backstage-plugin-scaffolder-git-actions";
import { ScmIntegrations } from '@backstage/integration';
import { createBuiltinActions, createRouter } from '@backstage/plugin-scaffolder-backend';

...

const integrations = ScmIntegrations.fromConfig(env.config);
const builtInActions = createBuiltinActions({
  catalogClient,
  integrations,
  config: env.config,
  reader: env.reader
});

const actions = [
  gitAction(),
  gitCloneAction(),
  ...builtInActions
];

return await createRouter({
  logger: env.logger,
  config: env.config,
  database: env.database,
  reader: env.reader,
  catalogClient,
  actions
});
```

## Example of using the generic git action
```yaml
---
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: clone-demo
  title: My custom git clone action
  description: scaffolder action to clone to the workspace directory
spec:
  owner: mdude2314
  type: service

  parameters:
    - title: Generic git
      properties:
        repoUrl:
          title: Command
          type: string
          description: Git command to run
        workingDirectory:
          title: Working Directory
          type: string
          description: The working directory within the scaffolder workspace to run the command
        args:
          title: Args
          type: array
          description: Arguments to pass to the clone command

  steps:
    - id: git
      name: git
      action: git
      input:
        command: ${{ parameters.command }} # ex: 'commit' - will make the scaffolder run the `git commit` command
        workingDirectory: ${{ parameters.workingDirectory }} # ex: './my-working-directory' - will execute the command in the specified directory relative to the scaffolder workspace
        args: ${{ parameters.args }} # ex: ['-m', 'My commit message'] - will add '-m My commit message' to the arguments passed to the git command
```

## Example of using the clone action

```yaml
---
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: clone-demo
  title: My custom git clone action
  description: scaffolder action to clone to the workspace directory
spec:
  owner: mdude2314
  type: service

  parameters:
    - title: Clone
      properties:
        repoUrl:
          title: Path
          type: string
          description: URL to clone
        args:
          title: Args
          type: array
          description: Arguments to pass to the clone command

  steps:
    - id: clone
      name: Clone
      action: git:clone
      input:
        repoUrl: ${{ parameters.repoUrl }}
        args: ${{ parameters.args }}
```
