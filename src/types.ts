import type { Type } from "@nestjs/common";

export type AnObject = Record<keyof any, any>;

export interface BetterConfigFactoryOptions {
  useClass: Type<AnObject>;
  sources: Array<AnObject | Promise<AnObject>>;
}
