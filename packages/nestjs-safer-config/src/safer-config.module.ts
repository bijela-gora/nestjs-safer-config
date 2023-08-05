import type { DynamicModule, FactoryProvider } from "@nestjs/common";
import { makeConfig } from "./make-config";
import type { SaferConfigModuleAsyncOptions, SaferConfigModuleOptions, Sources } from "./types";

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
    const { sourcesProvider } = options;

    const SOURCES_INJECTION_TOKEN = Symbol();

    const sourcesProviderFactory: FactoryProvider<Sources> = {
      provide: SOURCES_INJECTION_TOKEN,
      ...(sourcesProvider.inject ? sourcesProvider.inject : {}),
      useFactory: sourcesProvider.useFactory,
    };

    const instanceProvider: FactoryProvider<T> = {
      provide: options.createInstanceOf,
      useFactory: (sources: Sources) => makeConfig(options.createInstanceOf, sources),
      inject: [SOURCES_INJECTION_TOKEN],
    };

    return {
      module: SaferConfigModule,
      global: options.isGlobal ?? false,
      imports: options.imports ?? [],
      providers: [sourcesProviderFactory, instanceProvider],
      exports: [options.createInstanceOf],
    };
  }
}
