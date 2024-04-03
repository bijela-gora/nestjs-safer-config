import * as path from "node:path";
import { describe, expect, it } from "@jest/globals";
import { tryParseDotenvFile } from "./try-parse-dotenv-file";

describe("tryParseDotenvFile", () => {
  it("should fail if a .env file doesn't exist", () => {
    expect(() => tryParseDotenvFile(".env.doesnt.exist")).toThrow();
  });

  it("should use path if it's absolute", () => {
    expect(tryParseDotenvFile(path.join(__dirname, ".env.example"))).toEqual({ SECRET: "wasd" });
  });

  it("should not but it is support relative path", () => {
    expect(tryParseDotenvFile("src/sources/dotenv/.env.example")).toEqual({ SECRET: "wasd" });
  });

  it("should read .env file by default", () => {
    expect(tryParseDotenvFile()).toEqual({ PORT: "80", HOST: "0.0.0.0" });
  });
});
