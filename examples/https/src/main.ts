import * as fs from 'node:fs';
import * as path from 'node:path';
import * as tls from 'node:tls';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const httpsOptions: tls.SecureContextOptions = (() => {
    try {
      return {
        key: fs.readFileSync(path.join(__dirname, '..', 'private-key.pem'), 'utf-8'),
        cert: fs.readFileSync(path.join(__dirname, '..', 'certificate.pem'), 'utf-8'),
        ciphers: 'ECDHE-ECDSA-AES256-GCM-SHA384',
        minVersion: 'TLSv1.3',
      };
    } catch (e) {
      console.error(e.message);
      throw new Error('Probably you need to generate private-key.pem and certificate.pem. Check README.md');
    }
  })();

  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.use(
    helmet({
      xPoweredBy: false,
      strictTransportSecurity: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    }),
  );
  await app.listen(4433);
}
bootstrap();
