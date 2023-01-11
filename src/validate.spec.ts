import "reflect-metadata";
import { describe, expect } from "@jest/globals";
import { Contains, IsIn, IsInstance, IsNumber, IsPositive, MinLength, ValidateNested } from "class-validator";
import { Expose, Transform } from "class-transformer";
import { instantiate } from "./instantiate";
import { validate } from "./validate";

describe("validate", () => {
  it("should throw the error if extra property present", () => {
    class AppConfig {
      @IsIn(["development", "qa", "stage", "production"])
      @Expose()
      stage: string;

      @IsNumber({
        allowNaN: false,
        allowInfinity: false,
      })
      @Expose()
      secret: number;

      port: number;
    }

    const instance = instantiate(AppConfig, {
      stage: "qa",
      secret: "10543",
      port: 3000,
    });

    expect(instance.stage).toEqual("qa");
    expect(instance.secret).toEqual(10543);
    expect(instance.port).toEqual(3000);

    const expectedError = new Error(`An instance of AppConfig has failed the validation:
 - property port has failed the following constraints: property port should not exist `);
    expect(() => validate(instance)).toThrow(expectedError);
  });

  it("should throw particular message in case of any issue with AppConfig instance", () => {
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
      `An instance of AppConfig has failed the validation:
 - property stage has failed the following constraints: stage must be one of the following values: development, qa, stage, production 
 - property secret has failed the following constraints: secret must be a number conforming to the specified constraints `
    );
    expect(() => validate(instance)).toThrow(expectedError);
  });

  it("should return good message in case of validation of nested objects", () => {
    class Person {
      @MinLength(5)
      @Expose()
      name: string;

      @IsPositive()
      @IsNumber({
        allowNaN: false,
        allowInfinity: false,
        maxDecimalPlaces: 0,
      })
      @Expose()
      age: number;
    }

    class Worker {
      @Contains("hello")
      @Expose()
      title: string;

      @ValidateNested()
      @IsInstance(Person)
      @Transform((params) => instantiate(Person, params.value))
      @Expose()
      person: Person;
    }

    const instance = instantiate(Worker, {
      title: "Developer",
      person: {
        name: "Lol",
        age: -2,
      },
    });
    const expectedError = new Error(
      `An instance of Worker has failed the validation:
 - property title has failed the following constraints: title must contain a hello string 
 - property person.name has failed the following constraints: name must be longer than or equal to 5 characters 
 - property person.age has failed the following constraints: age must be a positive number `
    );
    expect(() => validate(instance)).toThrow(expectedError);
  });
});
