import type { ClassProvider, DynamicModule, FactoryProvider } from "@nestjs/common";
import { instantiateAndValidate } from "./instantiate-and-validate";
import type { SaferConfigModuleAsyncOptions, SaferConfigModuleOptions, Sources, SourcesClassProvider } from "./types";

export class SaferConfigModule {
  static register<T extends object>(options: SaferConfigModuleOptions<T>): DynamicModule {
    return {
      module: SaferConfigModule,
      global: options.isGlobal ?? false,
      providers: [
        {
          provide: options.createInstanceOf,
          useFactory: () => instantiateAndValidate(options.createInstanceOf, options.sources),
        },
      ],
      exports: [options.createInstanceOf],
    };
  }

  static registerAsync<T extends object>(options: SaferConfigModuleAsyncOptions<T>): DynamicModule {
    const module = {
      module: SaferConfigModule,
      global: options.isGlobal ?? false,
      imports: options.imports ?? [],
      exports: [options.createInstanceOf],
    };
    const SOURCES_INJECTION_TOKEN = Symbol();
    const instanceProvider: FactoryProvider<T> = {
      provide: options.createInstanceOf,
      useFactory: (sources: Sources) => instantiateAndValidate(options.createInstanceOf, sources),
      inject: [SOURCES_INJECTION_TOKEN],
    };

    const { sourcesProvider } = options;
    if ("useFactory" in sourcesProvider) {
      const sourcesProviderFactory: FactoryProvider<Sources> = {
        provide: SOURCES_INJECTION_TOKEN,
        ...(sourcesProvider.inject ? sourcesProvider.inject : {}),
        useFactory: sourcesProvider.useFactory,
      };
      return {
        ...module,
        providers: [sourcesProviderFactory, instanceProvider],
      };
    }

    if ("useClass" in sourcesProvider) {
      const SOURCES_FACTORY_PROVIDER = Symbol();
      const sourcesFactoryProvider: ClassProvider<SourcesClassProvider> = {
        provide: SOURCES_FACTORY_PROVIDER,
        useClass: sourcesProvider.useClass,
      };
      const sourcesProviderFactory: FactoryProvider<Sources> = {
        provide: SOURCES_INJECTION_TOKEN,
        inject: [SOURCES_FACTORY_PROVIDER],
        useFactory: (sourcesFactory: SourcesClassProvider) => sourcesFactory.make(),
      };
      return {
        ...module,
        providers: [sourcesFactoryProvider, sourcesProviderFactory, instanceProvider],
      };
    }

    throw new Error("'sourcesOptions' property should be an object with 'useFactory' or 'useClass' properties");
  }
}
