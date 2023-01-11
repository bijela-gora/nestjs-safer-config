# Configuration module for Nest

## Motivation

I wanted config module for NestJS to be:

- simple to use
- type-safe
- reliable
- explains when something goes wrong
- suitable for need of current project

And I did it.

## Examples

### Simple

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

   > **WARNING**: I strongly recommend to add `readonly` modifier to all and each fields

2. Second, import `BetterConfigModule` in the following way:

   ```typescript
   @Module({
     imports: [
       BetterConfigModule.register({
         isGlobal: true, // or false
         cls: AppConfig, // will be instantiated with data from `sources`. Should not have a `constructor` defined.
         sources: [
           // `sources` should be an array of objects or Promises which will resolve to objects
           // `sources` will be merged into one object. That object will be used to instantiate `AppConfig`
           // each property of all sources will be assigned to corresponding property of AppConfig
           // in this example let's use one object
           { SECRET_PHRASE: process.env["SECRET_PHRASE"], stage: process.env["STAGE_NAME"], port: process.env["PORT"] },
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

### With dotenv

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
       BetterConfigModule.register({
         isGlobal: true,
         cls: AppConfig,
         sources: [
           // `sources` will be merged into one object. That object will be used to instantiate `AppConfig`
           // each property of all sources will be assigned to corresponding property of AppConfig
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

The `BetterConfigModule` allows you to define and load multiple configuration from any source you want: plain object, yaml file, json file, toml file, or any other parsable format, or from HTTP json response or stream). You can manage complex configuration object hierarchies with nested configuration. But you SHOULD NOT do this from unknown places as `registerAs` method from `@nestjs/config` allows you to do. Yeah, you can put all such functions to one directory, and agree with your team to call `registerAs` only from that files. But this is not type-safe enough for me.

The main purpose of using `class-validator` and `class-transformer` packages is to allow developers to inject configuration class using **standard** and simplest constructor injection in a type-safe way.
One more advantage of using packages mentioned above is that they widely knew and used by default in NestJS projects.
The disadvantage is that decorators might be not the best way to describe expectations. For example, it is crucial to not forget to add `@ValidateNested()` if you need to validate nested instances. Or it is required to add `@Type(() => Number)` if you want to apply string-to-number transformations for a field.
Perhaps the biggest disadvantage is that at this moment the `class-validator` and `class-transformer` packages have little support. Little support from reach companies which makes money on open-source and a little support from package owners.
