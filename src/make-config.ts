import type { ClassConstructor } from "class-transformer";
import type { EmptyObject } from "./types";
import { instantiate } from "./instantiate";
import { validate } from "./validate";

export async function makeConfig<R extends EmptyObject>(
  createInstanceOf: ClassConstructor<R>,
  sources: Array<EmptyObject | Promise<EmptyObject>>
): Promise<R> {
  const obj: unknown = Object.assign({} as EmptyObject, ...(await Promise.all(sources))) as unknown;
  const instance = instantiate(createInstanceOf, obj);
  const validationResult = validate(instance);
  if (validationResult.success !== true) {
    throw validationResult.error;
  }
  const cfg: R = validationResult.value;
  return cfg;
}
