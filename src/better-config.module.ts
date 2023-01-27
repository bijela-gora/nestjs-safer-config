import type { DynamicModule, FactoryProvider } from "@nestjs/common";
import { makeConfig } from "./make-config";
import type { BetterConfigModuleAsyncOptions, BetterConfigOptions } from "./types";

export class BetterConfigModule {
  static register<T extends object>(options: BetterConfigOptions<T>): DynamicModule {
    return {
      module: BetterConfigModule,
      global: options.isGlobal ?? false,
      providers: [
        {
          provide: options.createInstanceOf,
          useFactory: () => makeConfig(options.createInstanceOf, options.sources),
        },
      ],
      exports: [options.createInstanceOf],
    };
  }

  static registerAsync<T extends object>(options: BetterConfigModuleAsyncOptions<T>): DynamicModule {
    const instanceProvider: FactoryProvider<T> = {
      provide: options.createInstanceOf,
      useFactory: async (...args: unknown[]) => {
        return makeConfig(options.createInstanceOf, await options.sourcesFactory(...args));
      },
      ...(options.inject ? { inject: options.inject } : undefined),
    };

    return {
      module: BetterConfigModule,
      global: options.isGlobal ?? false,
      imports: options.imports ?? [],
      providers: [instanceProvider],
      exports: [options.createInstanceOf],
    };
  }
}
