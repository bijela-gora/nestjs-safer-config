import "reflect-metadata";
import { describe, expect } from "@jest/globals";
import { Expose, Type } from "class-transformer";
import { Contains, IsBase64, IsIn, IsInstance, IsNumber, IsPositive, MinLength, ValidateNested } from "class-validator";

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
      @Type()
      PORT: number;

      @IsNumber()
      @Type()
      SECRET_FROM_DOT_ENV: number;

      @IsIn(["development", "qa", "stage", "production"])
      stage: string;

      @IsBase64()
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

  it("should instantiate nested objects if property doesn't decorated with @Type()", () => {
    class Person {
      @MinLength(1)
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
      @Contains("hello")
      title: string;

      @ValidateNested()
      @IsInstance(Person)
      person: Person;
    }

    const instance = instantiate(Worker, {
      title: "hello",
      person: {
        name: "Y",
        age: "30",
      },
    });
    expect(instance).toBeInstanceOf(Worker);
    expect(instance).toHaveProperty("title");
    expect(instance).toHaveProperty("person");
    expect(instance).toHaveProperty("person.name");
    expect(instance).toHaveProperty("person.age");
    expect(instance.person).toBeInstanceOf(Person);
    expect(instance.person.age).toEqual(30);
  });
});
