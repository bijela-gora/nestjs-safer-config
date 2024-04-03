import { tryParseDotenvFile } from "./try-parse-dotenv-file";

export function parseDotenvFile(filePath: string = ".env"): unknown {
  try {
    return tryParseDotenvFile(filePath);
  } catch {
    return Object.create(null);
  }
}
