import type { Type } from "@nestjs/common";

import type { AnObject, BetterConfigFactoryOptions } from "./types";
import { instantiate } from "./instantiate";
import { validate } from "./validate";

export async function makeConfig<T extends Type<AnObject>>(options: BetterConfigFactoryOptions<T>): Promise<T> {
  const sources = await Promise.all(options.sources);
  const instance = instantiate(options.useClass, Object.assign(Object.create(null), ...sources));
  const validationResult = validate(instance);
  if (validationResult.success !== true) {
    throw validationResult.error;
  }
  const cfg = validationResult.value;
  return cfg;
}
