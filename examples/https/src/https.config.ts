import { Contains, IsIn, IsOptional, IsString } from 'class-validator';
import tls from 'node:tls';

export class HttpsConfig {
  @IsString()
  @Contains('-----BEGIN EC PRIVATE KEY-----')
  @Contains('-----END EC PRIVATE KEY-----')
  readonly key!: string;

  @IsString()
  @Contains('-----BEGIN CERTIFICATE-----')
  @Contains('-----END CERTIFICATE-----')
  readonly cert!: string;

  @IsOptional()
  @IsString()
  readonly ciphers!: string;

  @IsString()
  @IsIn(['TLSv1.3', 'TLSv1.2'])
  readonly minVersion!: tls.SecureVersion;
}
