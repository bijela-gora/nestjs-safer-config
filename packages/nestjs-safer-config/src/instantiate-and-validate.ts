import type { ClassConstructor } from "class-transformer";
import { instantiate } from "./instantiate";
import { validate } from "./validate";
import type { Sources } from "./types";

export async function instantiateAndValidate<R extends object>(
  createInstanceOf: ClassConstructor<R>,
  sources: Sources
): Promise<R> {
  const obj: unknown = Object.assign({}, ...(await Promise.all(sources)));
  const validationResult = validate(instantiate(createInstanceOf, obj));
  if (validationResult.success !== true) {
    throw validationResult.error;
  }
  const cfg: R = validationResult.value;
  return cfg;
}
