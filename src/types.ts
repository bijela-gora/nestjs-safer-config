import type { ClassConstructor } from "class-transformer";
import type { InjectionToken, ModuleMetadata, OptionalFactoryDependency } from "@nestjs/common";

type ModuleMetadataImports = Pick<ModuleMetadata, "imports">;

export type Sources = Array<unknown | Promise<unknown>>;

export interface SaferConfigOptions<T> {
  isGlobal?: boolean;
  createInstanceOf: ClassConstructor<T>;
  sources: Sources;
}

export interface SaferConfigModuleAsyncOptions<T>
  extends Omit<SaferConfigOptions<T>, "sources">,
    ModuleMetadataImports {
  inject?: Array<InjectionToken | OptionalFactoryDependency>;
  sourcesFactory: (...args: any[]) => Promise<Sources> | Sources;
}
