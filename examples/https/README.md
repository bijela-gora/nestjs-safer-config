## Example code of how to use the `nestjs-safer-config` to

Repo was generated with: `npm exec --package=@nestjs/cli nest new https --strict`.

## How to generate private key and certificate for HTTPS

```shell
# Generate a private key
openssl ecparam -genkey -name prime256v1 -out private-key.pem

# Generate a certificate signing request (CSR)
openssl req -new -key private-key.pem -out csr.pem

# Generate a self-signed certificate using the CSR
openssl x509 -req -days 365 -in csr.pem -signkey private-key.pem -out certificate.pem
```

```shell
# To check if OpenSSL supports the ECDHE-ECDSA-AES256-GCM-SHA384 cipher suite, you can use the following command:
openssl ciphers -v 'ECDHE-ECDSA-AES256-GCM-SHA384'
```

## Useful links

- https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Protection_Cheat_Sheet.html
- https://infosec.mozilla.org/guidelines/web_security
- https://www.ssllabs.com/ssltest/
- https://ssl-config.mozilla.org/
- https://www.scottbrady91.com/openssl/creating-elliptical-curve-keys-using-openssl
