import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { instantiateAndValidate } from 'nestjs-safer-config';
import { getHttpsOptions } from './get-https-options';
import { HttpsConfig } from './https.config';

async function bootstrap() {
  const httpConfig = await instantiateAndValidate(HttpsConfig, [getHttpsOptions()]);
  const app = await NestFactory.create(AppModule, { httpsOptions: httpConfig });
  app.use(
    helmet({
      xPoweredBy: false,
      strictTransportSecurity: {
        maxAge: 31536000,
        includeSubDomains: true,
      },
    }),
  );
  await app.listen(4433);
}
bootstrap();
