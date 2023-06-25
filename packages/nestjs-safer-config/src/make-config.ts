import type { ClassConstructor } from "class-transformer";
import { instantiate } from "./instantiate";
import { validate } from "./validate";
import type { Sources } from "./types";

export async function makeConfig<R extends object>(
  createInstanceOf: ClassConstructor<R>,
  sources: Sources
): Promise<R> {
  const obj: unknown = Object.assign({} as Record<string, never>, ...(await Promise.all(sources)));
  const instance = instantiate(createInstanceOf, obj);
  const validationResult = validate(instance);
  if (validationResult.success !== true) {
    throw validationResult.error;
  }
  const cfg: R = validationResult.value;
  return cfg;
}
