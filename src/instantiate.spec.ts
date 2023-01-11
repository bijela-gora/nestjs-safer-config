import "reflect-metadata";
import { describe, expect } from "@jest/globals";
import { Expose, Type } from "class-transformer";
import { IsBase64, IsIn, IsNumber } from "class-validator";

import { instantiate } from "./instantiate";

describe("instantiate", () => {
  it("should expose extraneous properties", () => {
    class AppConfig {
      @IsNumber()
      @Expose()
      @Type()
      PORT: number;

      HOSTNAME: string;
    }

    const instance = instantiate(AppConfig, {
      PORT: "3000",
      HOSTNAME: "localhost",
    });
    expect(instance).toBeInstanceOf(AppConfig);

    expect(instance).toHaveProperty("PORT");
    expect(instance.PORT).toEqual(3000);

    expect(instance).toHaveProperty("HOSTNAME");
    expect(instance.HOSTNAME).toEqual("localhost");
  });

  it("should instantiate AppConfig with expected properties", () => {
    class AppConfig {
      @IsNumber()
      @Expose()
      @Type()
      PORT: number;

      @IsNumber()
      @Type()
      @Expose()
      SECRET_FROM_DOT_ENV: number;

      @IsIn(["development", "qa", "stage", "production"])
      @Expose()
      stage: string;

      @IsBase64()
      @Expose()
      secret: string;
    }

    const instance = instantiate(AppConfig, {
      PORT: "3000",
      SECRET_FROM_DOT_ENV: "123123",
      stage: "development",
      secret: "c2VjcmV0",
      version: 101,
    });
    expect(instance).toBeInstanceOf(AppConfig);

    expect(instance).toHaveProperty("PORT");
    expect(instance.PORT).toEqual(3000);

    expect(instance).toHaveProperty("SECRET_FROM_DOT_ENV");
    expect(instance.SECRET_FROM_DOT_ENV).toEqual(123123);

    expect(instance).toHaveProperty("stage");
    expect(instance.stage).toEqual("development");

    expect(instance).toHaveProperty("secret");
    expect(instance.secret).toEqual("c2VjcmV0");
  });
});
