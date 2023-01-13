import type { BetterConfigFactoryOptions } from "./types";
import { instantiate } from "./instantiate";
import { validate } from "./validate";

export async function makeConfig(options: BetterConfigFactoryOptions) {
  const sources = await Promise.all(options.sources);
  const instance = instantiate(options.useClass, Object.assign(Object.create(null), ...sources));
  const validationResult = validate(instance);
  if (validationResult.success !== true) {
    throw validationResult.error;
  }
  const cfg = validationResult.value;
  return cfg;
}
