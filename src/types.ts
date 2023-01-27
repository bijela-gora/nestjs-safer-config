import type { ClassConstructor } from "class-transformer";
import type { InjectionToken, ModuleMetadata, OptionalFactoryDependency } from "@nestjs/common";

export type AnObject = Record<keyof any, unknown>;
export type EmptyObject = Record<keyof any, never>;

export type Sources = Array<AnObject | Promise<AnObject>>;

interface WithIsGlobal {
  isGlobal?: boolean;
}

export interface BetterConfigOptions<T> extends WithIsGlobal {
  createInstanceOf: ClassConstructor<T>;
  sources: Array<AnObject | Promise<AnObject>>;
}

export interface BetterConfigModuleAsyncOptions<T> extends WithIsGlobal, Pick<ModuleMetadata, "imports"> {
  createInstanceOf: ClassConstructor<T>;
  inject?: Array<InjectionToken | OptionalFactoryDependency>;
  sourcesFactory: (...args: unknown[]) => Sources | Promise<Sources>;
}
