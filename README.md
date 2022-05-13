# backstage-plugin-scaffolder-git-actions package

This is a `git` actions plugin for the `scaffolder-backend` in Backstage.

This contains a collection of actions for using with git:

- git:clone

## Getting started

In the root directory of your Backstage project:

```
yarn add --cwd packages/backend @mdude2314/backstage-plugin-scaffolder-git-actions
```

Add the actions you'd like to the scaffolder:

```typescript
// packages/backend/src/plugins/scaffolder.ts

import { gitCloneAction } from "@mdude2314/backstage-plugin-scaffolder-git-actions";
...

const builtInActions = createBuiltinActions({
  catalogClient,
  integrations,
  config: env.config,
  reader: env.reader
});

const actions = [
  createGitAction(),
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
