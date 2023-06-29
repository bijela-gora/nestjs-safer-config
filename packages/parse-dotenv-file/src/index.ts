import * as path from "path";
import * as fs from "fs";
import { parse } from "dotenv";

export function tryParseDotenvFile(filePath: string = ".env"): unknown {
  return parse(fs.readFileSync(path.resolve(filePath), "utf-8"));
}

export function parseDotenvFile(filePath: string = ".env"): unknown {
  try {
    return tryParseDotenvFile(filePath);
  } catch {
    return Object.create(null);
  }
}
