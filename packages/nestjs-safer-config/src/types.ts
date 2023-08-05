import type { ClassConstructor } from "class-transformer";
import type { InjectionToken, ModuleMetadata, OptionalFactoryDependency } from "@nestjs/common";

type ModuleMetadataImports = Pick<ModuleMetadata, "imports">;

export type Sources = Array<unknown | Promise<unknown>>;

export interface SaferConfigModuleOptions<T> {
  isGlobal?: boolean;
  createInstanceOf: ClassConstructor<T>;
  sources: Sources;
}

export interface SaferConfigModuleAsyncOptions<T>
  extends Pick<SaferConfigModuleOptions<T>, "isGlobal" | "createInstanceOf">,
    ModuleMetadataImports {
  sourcesProvider: {
    inject?: Array<InjectionToken | OptionalFactoryDependency>;
    useFactory: (...args: any[]) => Promise<Sources> | Sources;
  };
}
