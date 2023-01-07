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
    validationError: { target: true, value: true },
  });
  if (errors.length > 0) {
    const message =
      `An instance of ${instance.constructor.name} has failed the validation:\n` +
      errors
        .map((e) => e.toString(undefined, undefined, undefined, true).replace(/ \n$/, "") + `, but got '${e.value}'\n`)
        .join("")
        .replaceAll(`An instance of ${instance.constructor.name} has failed the validation:\n`, "");

    throw new Error(message);
  }
  return instance;
}
