/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

/* eslint-disable import/no-import-module-exports */
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
/* eslint-enable import/no-import-module-exports */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const module: any;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);
  app.enableCors({ origin: '*' });

  // HMR support
  /* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  /* eslint-enable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */

  const port = process.env.PORT ?? 3000;

  await app.listen(port);
  Logger.log(`🚀 Application running on: http://localhost:${port}/${globalPrefix}`);
}

void bootstrap();
