import type { Type } from "@nestjs/common";

import type { AnObject } from "./types";
import { instantiate } from "./instantiate";
import { validate } from "./validate";

export async function makeConfig<T extends Type<AnObject>>(
  createInstanceOf: T,
  sources: Array<AnObject | Promise<AnObject>>
): Promise<T> {
  const instance = instantiate(createInstanceOf, Object.assign(Object.create(null), ...(await Promise.all(sources))));
  const validationResult = validate(instance);
  if (validationResult.success !== true) {
    throw validationResult.error;
  }
  const cfg = validationResult.value;
  return cfg;
}
