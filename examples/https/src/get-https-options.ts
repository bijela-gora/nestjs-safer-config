import type * as tls from 'node:tls';
import * as fs from 'node:fs';
import * as path from 'node:path';

export function getHttpsOptions(): tls.SecureContextOptions {
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
}
