import { parse } from "dotenv";
import fs from "fs";
import path from "path";

export function tryParseDotenvFile(filePath: string = ".env"): unknown {
  return parse(fs.readFileSync(path.resolve(filePath), "utf-8"));
}
