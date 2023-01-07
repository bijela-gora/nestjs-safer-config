import "reflect-metadata";
import { describe, expect } from "@jest/globals";
import { IsIn, IsNumber } from "class-validator";
import { Expose } from "class-transformer";
import { instantiate } from "./instantiate";
import { validate } from "./validate";

describe("validate", () => {
  it("should throw in case of any issue with AppConfig instance", () => {
    class AppConfig {
      @IsIn(["development", "qa", "stage", "production"])
      @Expose()
      stage: string;

      @IsNumber()
      @Expose()
      secret: number;
    }

    const instance = instantiate(AppConfig, {
      stage: "dev",
      secret: "10_543",
    });

    expect(instance).toHaveProperty("stage");
    expect(instance.stage).toEqual("dev");

    const expectedError = new Error(
      "An instance of AppConfig has failed the validation:\n" +
        " - property stage has failed the following constraints: stage must be one of the following values: development, qa, stage, production, but got 'dev'\n" +
        " - property secret has failed the following constraints: secret must be a number conforming to the specified constraints, but got '10_543'\n"
    );
    expect(() => validate(instance)).toThrow(expectedError);
  });
});
