import type { ClassConstructor } from "class-transformer";
import type { InjectionToken, ModuleMetadata, OptionalFactoryDependency } from "@nestjs/common";

type ModuleMetadataImports = Pick<ModuleMetadata, "imports">;

export type EmptyObject = Record<never, never>;

export type Sources = Array<EmptyObject | Promise<EmptyObject>>;

export interface BetterConfigOptions<T> {
  isGlobal?: boolean;
  createInstanceOf: ClassConstructor<T>;
  sources: Sources;
}

export interface BetterConfigModuleAsyncOptions<T>
  extends Omit<BetterConfigOptions<T>, "sources">,
    ModuleMetadataImports {
  inject?: Array<InjectionToken | OptionalFactoryDependency>;
  sourcesFactory: (...args: unknown[]) => Promise<Sources>;
}
