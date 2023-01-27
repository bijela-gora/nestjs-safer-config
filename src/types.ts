import type { ClassConstructor } from "class-transformer";
import type { InjectionToken, ModuleMetadata, OptionalFactoryDependency } from "@nestjs/common";

type ModuleMetadataImports = Pick<ModuleMetadata, "imports">;

export type Sources = Array<object | Promise<object>>;

export interface SaferConfigOptions<T> {
  isGlobal?: boolean;
  createInstanceOf: ClassConstructor<T>;
  sources: Sources;
}

export interface SaferConfigModuleAsyncOptions<T>
  extends Omit<SaferConfigOptions<T>, "sources">,
    ModuleMetadataImports {
  inject?: Array<InjectionToken | OptionalFactoryDependency>;
  sourcesFactory: (...args: unknown[]) => Promise<Sources> | Sources;
}
