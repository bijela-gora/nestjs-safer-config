import "reflect-metadata";
import { instantiateAndValidate } from "./index";
import { describe, expect } from "@jest/globals";
import { IsInt, IsPort } from "class-validator";

describe("instantiateAndValidate", () => {
  it("should instantiate class and validate data", async () => {
    class AppConfig {
      @IsPort()
      port: string;
    }
    const cfg = await instantiateAndValidate(AppConfig, [{ port: "80" }]);
    expect(cfg).toBeInstanceOf(AppConfig);
    expect(cfg.port).toEqual("80");
  });

  it("should throw an error if validation didn't pass", async () => {
    class AppConfig {
      @IsInt()
      port: string;
    }
    await expect(async () => {
      await instantiateAndValidate(AppConfig, [{ port: Math.PI }]);
    }).rejects.toThrow(
      `An instance of AppConfig has failed the validation:
 - property port has failed the following constraints: port must be an integer number 
`,
    );
  });

  it("should assign default value", async () => {
    class AppConfig {
      @IsPort()
      port: string = "3000";
    }
    const cfg = await instantiateAndValidate(AppConfig, []);
    expect(cfg).toBeInstanceOf(AppConfig);
    expect(cfg.port).toEqual("3000");
  });

  it("should assign default value, validate and throw an error if some property value is invalid", async () => {
    class AppConfig {
      @IsPort()
      port = 3000;
    }
    await expect(async () => {
      await instantiateAndValidate(AppConfig, []);
    }).rejects.toThrow(
      `An instance of AppConfig has failed the validation:
 - property port has failed the following constraints: port must be a port 
`,
    );
  });
});
