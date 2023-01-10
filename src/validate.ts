import type { AnObject } from "./types";
import { validateSync, ValidationError } from "class-validator";

type NonEmptyArray<T> = [T, ...T[]];

function isNotEmptyArray<T>(arr: T[]): arr is NonEmptyArray<T> {
  return arr.length > 0;
}

function errorsToMessage(errors: NonEmptyArray<ValidationError>): string {
  return errors
    .map((e) => e.toString(undefined, undefined, undefined, true))
    .flatMap((str) => str.split("\n"))
    .filter((str) => str !== "")
    .filter((str, i) => i === 0 || !(str.includes("An instance of ") && str.includes(" has failed the validation:")))
    .join("\n");
}

export function validate<T extends AnObject>(instance: T): T {
  const errors = validateSync(instance, {
    enableDebugMessages: false,
    skipUndefinedProperties: false,
    skipNullProperties: false,
    skipMissingProperties: false,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    validationError: { target: true, value: true },
  });
  if (isNotEmptyArray(errors)) {
    const message = errorsToMessage(errors);
    throw new Error(message);
  }
  return instance;
}
