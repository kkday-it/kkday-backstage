import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
// yarn add --cwd packages/backend @backstage/plugin-catalog-backend-module-github
import { GithubOrgEntityProvider } from '@backstage/plugin-catalog-backend-module-github';
import { GithubEntityProvider } from '@backstage/plugin-catalog-backend-module-github';
import { KKEntitiesProcessor } from '@internal/plugin-kkday-entities-common';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  builder.addEntityProvider(
    GithubOrgEntityProvider.fromConfig(env.config, {
      id: 'production',
      orgUrl: 'https://github.com/kkday-it',
      logger: env.logger,
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { minutes: 60 },
        timeout: { minutes: 15 },
      }),
    }),
  );
  builder.addEntityProvider(
    GithubEntityProvider.fromConfig(env.config, {
      logger: env.logger,
      // optional: alternatively, use scheduler with schedule defined in app-config.yaml
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { minutes: 30 },
        timeout: { minutes: 3 },
      }),
      // optional: alternatively, use schedule
      scheduler: env.scheduler,
    }),
  );
  // builder.addProcessor(new KKEntitiesProcessor());
  const { processingEngine, router } = await builder.build();
  await processingEngine.start();
  return router;
}
