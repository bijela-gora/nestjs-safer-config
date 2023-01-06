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
    const message = errors.map((e) => e.toString(undefined, undefined, undefined, true)).join("");
    throw new Error(
      "An instance of an object has failed the validation:\n" +
        message.replaceAll("An instance of an object has failed the validation:\n", "")
    );
  }
  return instance;
}
