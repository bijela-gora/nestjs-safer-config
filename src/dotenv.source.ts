import fs from "node:fs";
import path from "node:path";

import * as dotenv from "dotenv";

export function dotEnvSource(fileNameOrAbsolutePathToFile = ".env") {
  const pathToEnvFile = path.isAbsolute(fileNameOrAbsolutePathToFile)
    ? fileNameOrAbsolutePathToFile
    : path.join(process.cwd(), fileNameOrAbsolutePathToFile);
  return dotenv.parse(fs.readFileSync(pathToEnvFile));
}
