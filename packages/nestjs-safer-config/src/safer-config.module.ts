import type { DynamicModule, FactoryProvider } from "@nestjs/common";
import { makeConfig } from "./make-config";
import type { SaferConfigModuleAsyncOptions, SaferConfigModuleOptions } from "./types";

export class SaferConfigModule {
  static register<T extends object>(options: SaferConfigModuleOptions<T>): DynamicModule {
    return {
      module: SaferConfigModule,
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

  static registerAsync<T extends object>(options: SaferConfigModuleAsyncOptions<T>): DynamicModule {
    const instanceProvider: FactoryProvider<T> = {
      provide: options.createInstanceOf,
      useFactory: async (...args) => {
        return makeConfig(
          options.createInstanceOf,
          await options.sourcesFactory(
            ...args // eslint-disable-line @typescript-eslint/no-unsafe-argument
          )
        );
      },
      ...(options.inject ? { inject: options.inject } : undefined),
    };

    return {
      module: SaferConfigModule,
      global: options.isGlobal ?? false,
      imports: options.imports ?? [],
      providers: [instanceProvider],
      exports: [options.createInstanceOf],
    };
  }
}
