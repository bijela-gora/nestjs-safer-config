import type { EmptyObject } from "./types";
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

export function validate<T extends EmptyObject>(instance: T): Result<T> {
  const errors = validateSync(instance, {
    enableDebugMessages: true,
    skipUndefinedProperties: false,
    skipNullProperties: false,
    skipMissingProperties: false,
    whitelist: true,
    forbidNonWhitelisted: false,
    forbidUnknownValues: true,
    validationError: { target: true, value: true },
  });
  if (isNotEmptyArray(errors)) {
    const message = showErrors(errors);
    return { success: false, error: new TypeError(message) };
  }
  return { success: true, value: instance };
}
