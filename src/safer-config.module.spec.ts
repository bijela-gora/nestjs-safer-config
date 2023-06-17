import { Test } from "@nestjs/testing";
import { describe, it, expect } from "@jest/globals";
import { IsPort } from "class-validator";
import { SaferConfigModule } from "./safer-config.module";
import { Injectable } from "@nestjs/common";

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
});
