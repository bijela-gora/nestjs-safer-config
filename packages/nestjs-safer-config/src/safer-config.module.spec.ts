import { Test } from "@nestjs/testing";
import { describe, it, expect } from "@jest/globals";
import { IsBase64, IsPort, IsString } from "class-validator";
import { SaferConfigModule } from "./safer-config.module";
import { Injectable, Module } from "@nestjs/common";
import { Sources, SourcesClassProvider } from "./types";

jest.setTimeout(1000);

describe("SaferConfigModule", () => {
  it("it should be possible to get AppConfig instance from DI", async () => {
    class AppConfig {
      @IsPort()
      port: string = "3000";
    }

    const AppConfigModule = SaferConfigModule.register({
      isGlobal: true,
      createInstanceOf: AppConfig,
      sources: [{ port: "80" }],
    });

    const moduleRef = await Test.createTestingModule({
      imports: [AppConfigModule],
    }).compile();

    const appConfigInstance = moduleRef.get(AppConfig);
    expect(appConfigInstance.port).toEqual("80");
  });

  it("it should be possible to inject AppConfig instance to a service", async () => {
    class AppConfig {
      @IsPort()
      port: string = "3000";
    }

    const AppConfigModule = SaferConfigModule.register({
      isGlobal: true,
      createInstanceOf: AppConfig,
      sources: [{ port: "80" }],
    });

    @Injectable()
    class SomeService {
      constructor(private readonly appConfig: AppConfig) {}

      public getPort(): number {
        return Number(this.appConfig.port);
      }
    }

    const moduleRef = await Test.createTestingModule({
      imports: [AppConfigModule],
      providers: [SomeService],
    }).compile();

    const someServiceInstance = moduleRef.get(SomeService);
    expect(someServiceInstance.getPort()).toEqual(80);
  });

  describe("registerAsync", () => {
    it("should accept FactoryProvider to instantiate sources", async () => {
      class AppConfig {
        @IsPort()
        port: string;
      }

      const AppConfigModule = SaferConfigModule.registerAsync({
        createInstanceOf: AppConfig,
        sourcesProvider: { useFactory: () => [{ port: "80" }] },
      });

      const moduleRef = await Test.createTestingModule({
        imports: [AppConfigModule],
      }).compile();

      const appConfigInstance = moduleRef.get(AppConfig);
      expect(appConfigInstance.port).toEqual("80");
    });

    it("should accept FactoryProvider with inject to instantiate sources", async () => {
      class SecretsConfig {
        @IsString()
        secret: string;
      }

      const SecretsConfigModule = SaferConfigModule.register({
        createInstanceOf: SecretsConfig,
        sources: [{ secret: "123" }],
      });

      class AppConfig {
        @IsPort()
        port: string;
      }

      const AppConfigModule = SaferConfigModule.registerAsync({
        imports: [SecretsConfigModule],
        createInstanceOf: AppConfig,
        sourcesProvider: {
          inject: [SecretsConfig],
          useFactory: async (secretsConfig: SecretsConfig) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                if (secretsConfig.secret === "123") {
                  resolve([{ port: 80 }]);
                } else {
                  reject(new Error("can't get secret"));
                }
              }, 20);
            }),
        },
      });

      const moduleRef = await Test.createTestingModule({ imports: [AppConfigModule] }).compile();
      const appConfigInstance = moduleRef.get(AppConfig);
      expect(appConfigInstance.port).toEqual("80");
    });

    it("should accept FactoryProvider to instantiate sources", async () => {
      class AppConfig {
        @IsBase64()
        secret: string;
      }

      class FakeHttpService {
        getSecrets() {
          return Promise.resolve({ secret: "YSBzZWNyZXQ=" });
        }
      }

      @Module({
        providers: [FakeHttpService],
        exports: [FakeHttpService],
      })
      class FakeHttpModule {}

      @Injectable()
      class SecretsSourcesFactory implements SourcesClassProvider {
        constructor(private readonly httpServiceFake: FakeHttpService) {}

        make(): Sources {
          return [this.httpServiceFake.getSecrets()];
        }
      }

      const AppConfigModule = SaferConfigModule.registerAsync({
        imports: [FakeHttpModule],
        createInstanceOf: AppConfig,
        sourcesProvider: { useClass: SecretsSourcesFactory },
      });

      const moduleRef = await Test.createTestingModule({
        imports: [AppConfigModule],
      }).compile();

      const appConfigInstance = moduleRef.get(AppConfig);
      expect(appConfigInstance.secret).toEqual("YSBzZWNyZXQ=");
    });
  });
});
