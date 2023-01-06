import type { AnObject } from "./types";
import { validateSync } from "class-validator";

export function validate<T extends AnObject>(instance: T): T {
  const errors = validateSync(instance, {
    enableDebugMessages: true,
    skipUndefinedProperties: false,
    skipNullProperties: false,
    skipMissingProperties: false,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    validationError: { target: false, value: false },
  });
  if (errors.length > 0) {
    throw new Error(errors.map((e) => e.toString()).join("\n"));
  }
  return instance;
}
