import type { ClassConstructor } from "class-transformer";
import type { ClassProvider, FactoryProvider, ModuleMetadata } from "@nestjs/common";

type ModuleMetadataImports = Pick<ModuleMetadata, "imports">;

export type Sources = Array<unknown | Promise<unknown>>;

export interface SaferConfigModuleOptions<T> {
  isGlobal?: boolean;
  createInstanceOf: ClassConstructor<T>;
  sources: Sources;
}

export interface SaferConfigModuleAsyncOptions<T>
  extends Pick<SaferConfigModuleOptions<T>, "isGlobal" | "createInstanceOf">,
    ModuleMetadataImports,
    SourcesProviderOption {}

export interface SourcesClassProvider {
  make(): Sources;
}

export interface SourcesProviderOption {
  sourcesProvider:
    | Pick<ClassProvider<SourcesClassProvider>, "useClass">
    | Pick<FactoryProvider<Sources>, "inject" | "useFactory">;
}
