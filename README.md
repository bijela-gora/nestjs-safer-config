# Configuration module for NestJS

Currently, this package is intended only for `class-transformer` and `class-validator` users.

## Motivation

I wanted config module for NestJS to be:

- easy to use
- type-safe
- reliable
- explains when something goes wrong
- suitable for need of current project

And I made it.

## Description

The `SaferConfigModule` allows to define and load multiple configuration from any source you want: plain object, yaml file, json file, toml file, or any other parsable format, or from HTTP json response or stream).

You can manage complex configuration object hierarchies with nested configuration.

## How to use

### process.env

1. First, describe how config should look like using class declaration statement. And decorate fields with `class-validator` decorators. For example,

   ```typescript
   class AppConfig {
     @IsString()
     SECRET_PHRASE: string;

     @IsIn(["development", "qa", "stage", "production"])
     stage: string = "development"; // here you can use the default values, they are the lowest priority

     @IsPort() // @IsPort() checks if the value is a string and is a valid port number.
     port: string = "3000";
   }
   ```

   > **NOTE**: I strongly recommend to add `readonly` modifier to all and each fields

2. Second, import `SaferConfigModule` in the following way:

   ```typescript
   @Module({
     imports: [
       SaferConfigModule.register({
         isGlobal: true, // or false, or you can skip `isGlobal`
         cls: AppConfig, // will be instantiated with data from `sources`. Should not have a `constructor` defined, or `constructor` shouldn't expect any arguments
         sources: [
           // `sources` must be an array of objects or promises of objects
           // `sources` will be merged into one object with `Object.assign()`. That object will be used to populate `AppConfig` properties
           // in this example let's use one object
           process.env,
         ],
       }),
     ],
     controllers: [AppController],
     providers: [AppService],
   })
   export class AppModule {}
   ```

3. Third, use the class identifier as NestJS provider token

   - for example, here how it can be injected in `AppService`

     ```typescript
     @Injectable()
     export class AppService {
       constructor(private readonly appConfig: AppConfig) {}

       getHello(): string {
         return `Hello World! Here is my secret '${this.appConfig.SECRET_PHRASE}'`;
       }
     }
     ```

   - or in `main.ts`

     ```typescript
     async function bootstrap() {
       const app = await NestFactory.create(AppModule);
       const cfg = app.get(AppConfig);
       await app.listen(cfg.port);
     }
     bootstrap();
     ```

4. Last thing to do is to start your app and provide environment variables:
   ```shell
   SECRET_PHRASE='somesecret' stage=stage port=8080 node ./dist/main.js
   ```

### dotenv

`dotenv` package exports useful `parse` function. Let's utilize it to read `.env` file.

1. Create a file and name it `dotenv.source.ts` for example

   ```typescript
   import * as fs from "node:fs";
   import * as path from "node:path";

   import * as dotenv from "dotenv";

   export function dotEnvSource(fileNameOrAbsolutePathToFile = ".env") {
     const pathToEnvFile = path.isAbsolute(fileNameOrAbsolutePathToFile)
       ? fileNameOrAbsolutePathToFile
       : path.join(process.cwd(), fileNameOrAbsolutePathToFile);
     return dotenv.parse(fs.readFileSync(pathToEnvFile));
   }
   ```

2. Pass the result to sources

   ```typescript
   import { dotEnvSource } from "@src/path/to/dotenv.source";

   @Module({
     imports: [
       SaferConfigModule.register({
         isGlobal: true,
         cls: AppConfig,
         sources: [
           // `sources` will be merged into one object with `Object.assign()`. That object will be used to populate `AppConfig` properties
           dotEnvSource(),
           process.env,
         ],
       }),
     ],
     controllers: [AppController],
     providers: [AppService],
   })
   export class AppModule {}
   ```

## Trade-offs

1. The main purpose of using `class-validator` and `class-transformer` packages is to allow developers to inject configuration object as a dependency using **standard** and simplest constructor injection in a type-safe way. One more advantage of using packages mentioned above is that they widely knew and used by default in NestJS projects. The disadvantage is that decorators might be not the best way to describe expectations. For example, it is crucial to not forget to add `@ValidateNested()` if you need to validate nested instances. Or it is required to add `@Type(() => Number)` if you want to apply string-to-number transformations for a field. Perhaps the biggest disadvantage is that at this moment the `class-validator` and `class-transformer` packages have little support. Little support from reach companies which makes money on open-source and a little support from package owners.
2. `@nestjs/config` have `registerAs` method. With this kind of API there is no way to achieve type-safety, so, there is no such feature in `nestjs-safer-config` package.
