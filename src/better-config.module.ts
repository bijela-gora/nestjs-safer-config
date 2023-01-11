import type { DynamicModule } from "@nestjs/common";
import { instantiate } from "./instantiate";
import type { BetterConfigModuleOptions, JsonObject } from "./types";
import { validate } from "./validate";

export class BetterConfigModule {
  static async register(options: BetterConfigModuleOptions): Promise<DynamicModule> {
    const sources: JsonObject[] = await Promise.all(options.sources);
    const instance = instantiate(options.cls, Object.assign(Object.create(null), ...sources));
    const validationResult = validate(instance);
    if (validationResult.success !== true) {
      throw validationResult.error;
    }

    const cfg = validationResult.value;
    return {
      module: BetterConfigModule,
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
