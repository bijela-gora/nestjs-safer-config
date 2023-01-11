import type { Type } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import type { AnObject } from "./types";

export function instantiate<T extends AnObject>(cls: Type<T>, obj: AnObject): T {
  return plainToInstance(cls, obj, {
    enableImplicitConversion: true,
    excludeExtraneousValues: false,
    exposeDefaultValues: true,
  });
}
