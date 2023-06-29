import * as path from "node:path";
import { describe, expect, it } from "@jest/globals";
import { parseDotenvFile, tryParseDotenvFile } from "./index";

describe("tryParseDotenvFile", () => {
  it("should fail if a .env file doesn't exist", () => {
    expect(() => tryParseDotenvFile(".env.doesnt.exist")).toThrow();
  });

  it("should use path if it's absolute", () => {
    expect(tryParseDotenvFile(path.join(__dirname, ".env.example"))).toEqual({ SECRET: "wasd" });
  });

  it("should not but it is support relative path", () => {
    expect(tryParseDotenvFile("src/.env.example")).toEqual({ SECRET: "wasd" });
  });

  it("should read .env file by default", () => {
    expect(tryParseDotenvFile()).toEqual({ PORT: "80", HOST: "0.0.0.0" });
  });

  it("should read, parse and return value", () => {
    expect(tryParseDotenvFile(".env.example")).toEqual({ SECRET: "wasd" });
  });
});

describe("parseDotenvFile", () => {
  it("should return empty object if a .env file doesn't exist", () => {
    expect(parseDotenvFile(".env.doesnt.exist")).toEqual({});
  });
});
