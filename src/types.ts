import type { Type } from "@nestjs/common";

export type AnObject = Record<keyof any, any>;

export interface BetterConfigFactoryOptions<T extends Type<AnObject>> {
  useClass: T;
  sources: Array<AnObject | Promise<AnObject>>;
}
