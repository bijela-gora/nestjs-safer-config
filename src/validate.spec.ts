import "reflect-metadata";
import { describe, expect } from "@jest/globals";
import {
  Contains,
  IsArray,
  IsIn,
  IsInstance,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
  ValidateNested,
} from "class-validator";
import { validate } from "./validate";

describe("validate", () => {
  it("should return the error if extra property present", () => {
    class AppConfig {
      @IsNumber({
        allowNaN: false,
        allowInfinity: false,
      })
      secret: number;

      port: number;
    }

    const instance = Object.assign(new AppConfig(), {
      secret: 10543,
      port: 3000,
    });

    const result = validate(instance);
    expect(result).toEqual({
      success: false,
      error: new TypeError(
        "An instance of AppConfig has failed the validation:\n" +
          " - property port has failed the following constraints: property port should not exist \n"
      ),
    });
  });

  it("should validate arrays", () => {
    class SchedulerConfig {
      @IsArray()
      @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 }, { each: true })
      days: number[];
    }

    const instance = Object.assign(new SchedulerConfig(), {
      days: [1, "2", null],
    });

    const result = validate(instance);
    expect(result).toEqual({
      success: false,
      error: new TypeError(
        "An instance of SchedulerConfig has failed the validation:\n" +
          " - property days has failed the following constraints: each value in days must be a number conforming to the specified constraints \n"
      ),
    });
  });

  it("should validate arrays of objects", () => {
    class SchedulerConfig {
      @IsString()
      cron: string;
    }

    class AppConfig {
      @IsInstance(SchedulerConfig, { each: true })
      @ValidateNested()
      schedulers: SchedulerConfig[];
    }

    const instance = Object.assign(new AppConfig(), {
      schedulers: [new SchedulerConfig()],
    });

    const result = validate(instance);
    expect(result).toEqual({
      success: false,
      error: new TypeError(
        "An instance of AppConfig has failed the validation:\n" +
          " - property schedulers[0].cron has failed the following constraints: cron must be a string \n"
      ),
    });
  });

  it("should validate arrays of objects when objects (case: one object was not instantiated)", () => {
    class SchedulerConfig {
      @IsString()
      cron: string;
    }

    class AppConfig {
      @IsArray()
      @IsInstance(SchedulerConfig, { each: true })
      schedulers: SchedulerConfig[];
    }

    const scheduleCfg = new SchedulerConfig();
    scheduleCfg.cron = "45 23 * * 6";
    const instance = Object.assign(new AppConfig(), { schedulers: [scheduleCfg, { cron: "45 23 * * 6" }] });

    const result = validate(instance);
    expect(result).toEqual({
      success: false,
      error: new TypeError(
        "An instance of AppConfig has failed the validation:\n" +
          " - property schedulers has failed the following constraints: each value in schedulers must be an instance of SchedulerConfig \n"
      ),
    });
  });

  it("should return an error where all validation issues described", () => {
    class AppConfig {
      @IsIn(["development", "qa", "stage", "production"])
      stage: string;

      @IsNumber()
      secret: number;
    }

    const instance = Object.assign(new AppConfig(), {
      stage: "dev",
      secret: "10_543",
    });

    const result = validate(instance);
    expect(result).toEqual({
      success: false,
      error: new TypeError(
        "An instance of AppConfig has failed the validation:\n" +
          " - property stage has failed the following constraints: stage must be one of the following values: development, qa, stage, production \n" +
          "\n" +
          "An instance of AppConfig has failed the validation:\n" +
          " - property secret has failed the following constraints: secret must be a number conforming to the specified constraints \n"
      ),
    });
  });

  it("should return an error with good message in case of validation failed for nested object", () => {
    class Person {
      @MinLength(3)
      name: string;

      @IsPositive()
      @IsNumber({
        allowNaN: false,
        allowInfinity: false,
        maxDecimalPlaces: 0,
      })
      age: number;
    }

    class Worker {
      @Contains("Manager")
      title: string;

      @ValidateNested()
      @IsInstance(Person)
      person: Person;
    }

    const subInstance = Object.assign(new Person(), {
      name: "Y",
      age: -1,
    });

    const instance = new Worker();
    Object.assign(instance, {
      title: "Developer",
      person: subInstance,
    });

    const result = validate(instance);
    expect(result).toEqual({
      success: false,
      error: new TypeError(
        "An instance of Worker has failed the validation:\n" +
          " - property title has failed the following constraints: title must contain a Manager string \n" +
          "\n" +
          "An instance of Worker has failed the validation:\n" +
          " - property person.name has failed the following constraints: name must be longer than or equal to 3 characters \n" +
          " - property person.age has failed the following constraints: age must be a positive number \n"
      ),
    });
  });
});
