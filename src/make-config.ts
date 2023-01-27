import type { ClassConstructor } from "class-transformer";
import type { AnObject, EmptyObject } from "./types";
import { instantiate } from "./instantiate";
import { validate } from "./validate";

export async function makeConfig<R extends AnObject>(
  createInstanceOf: ClassConstructor<R>,
  sources: Array<AnObject | Promise<AnObject>>
): Promise<R> {
  const obj = Object.assign({} as EmptyObject, ...(await Promise.all(sources))) as AnObject;
  const instance = instantiate(createInstanceOf, obj);
  const validationResult = validate(instance);
  if (validationResult.success !== true) {
    throw validationResult.error;
  }
  const cfg: R = validationResult.value;
  return cfg;
}
