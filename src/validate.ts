import type { AnObject } from "./types";
import { validateSync, ValidationError } from "class-validator";

type NonEmptyArray<T> = [T, ...T[]];

function isNotEmptyArray<T>(arr: T[]): arr is NonEmptyArray<T> {
  return arr.length > 0;
}

function showErrors(errors: NonEmptyArray<ValidationError>): string {
  return errors.map((e) => e.toString(undefined, undefined, undefined, true)).join("\n");
}

type Result<T> =
  | {
      success: true;
      value: T;
    }
  | {
      success: false;
      error: Error;
    };

export function validate<T extends AnObject>(instance: T): Result<T> {
  const errors = validateSync(instance, {
    enableDebugMessages: true,
    skipUndefinedProperties: false,
    skipNullProperties: false,
    skipMissingProperties: false,
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    validationError: { target: true, value: true },
  });
  if (isNotEmptyArray(errors)) {
    const message = showErrors(errors);
    return { success: false, error: new Error(message) };
  }
  return { success: true, value: instance };
}
