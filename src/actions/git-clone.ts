import { createTemplateAction, executeShellCommand } from '@backstage/plugin-scaffolder-backend';
import * as fsPromises from 'fs/promises';
import * as fs from 'fs';

export const gitCloneAction = () => {
  return createTemplateAction<{ repoUrl: string; args: string[] }>({
    id: 'git:clone',
    schema: {
      input: {
        required: ['repoUrl'],
        type: 'object',
        properties: {
          repoUrl: {
            type: 'string',
            title: 'Repository URL',
            description: 'The repository to clone',
          },
          args: {
            type: 'array',
            items: {
              type: 'string',
            },
            title: 'Arguments to pass to the command'
          }
        },
      },
    },
    async handler(ctx) {
      ctx.logger.info(`repoUrl: ${ctx.input.repoUrl}`);

      const splitRepoUrl = ctx.input.repoUrl.split('/');
      const fileName = splitRepoUrl[splitRepoUrl.length - 1];

      if (fs.existsSync(fileName)) {
        ctx.logger.info(`File ${fileName} exists in workspace, removing...`);
        await fsPromises.rm(fileName, { recursive: true, force: true });
      }

      let args = ['clone', ctx.input.repoUrl];
      if (ctx.input.args && ctx.input.args.length) {
        args = [...args, ...ctx.input.args];
      }
      await executeShellCommand({
        command: 'git',
        args,
        logStream: ctx.logStream,
        options: {
          cwd: ctx.workspacePath
        }
      });

      ctx.logger.info(`Finished cloning ${ctx.input.repoUrl}`);
    },
  });
};