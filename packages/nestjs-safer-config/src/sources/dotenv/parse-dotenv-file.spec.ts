import { describe, expect, it } from "@jest/globals";
import { parseDotenvFile } from "./parse-dotenv-file";

describe("parseDotenvFile", () => {
  it("should return empty object if a .env file doesn't exist", () => {
    expect(parseDotenvFile(".env.doesnt.exist")).toEqual({});
  });
});
