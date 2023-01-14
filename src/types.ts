import type { InjectionToken, ModuleMetadata, OptionalFactoryDependency, Type } from "@nestjs/common";

export type AnObject = Record<keyof any, any>;

export type Sources = Array<AnObject | Promise<AnObject>>;

type WithIsGlobal = { isGlobal?: boolean };

export interface BetterConfigOptions<T extends Type<AnObject>> extends WithIsGlobal {
  createInstanceOf: T;
  sources: Array<AnObject | Promise<AnObject>>;
}

export interface BetterConfigModuleAsyncOptions<T extends Type<AnObject>>
  extends WithIsGlobal,
    Pick<ModuleMetadata, "imports"> {
  createInstanceOf: T;
  inject?: Array<InjectionToken | OptionalFactoryDependency>;
  sourcesFactory: (...args: any[]) => Sources | Promise<Sources>;
}
