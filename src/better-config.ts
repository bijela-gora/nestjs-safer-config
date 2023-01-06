import type { DynamicModule } from "@nestjs/common";
import { instantiate } from "./instantiate";
import type { AnObject, BetterConfigModuleOptions, JsonObject } from "./types";
import { validate } from "./validate";

export class BetterConfig {
  static async register(options: BetterConfigModuleOptions): Promise<DynamicModule> {
    const sources: JsonObject[] = await Promise.all(options.sources);
    const instance = instantiate(options.cls, Object.assign(Object.create(null), ...sources));
    const cfg: AnObject = validate(instance);

    return {
      module: BetterConfig,
      global: options.isGlobal ?? false,
      providers: [
        {
          provide: options.cls,
          useValue: cfg,
        },
      ],
      exports: [options.cls],
    };
  }
}
