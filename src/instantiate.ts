import { ClassConstructor, plainToInstance } from "class-transformer";
import type { AnObject } from "./types";

export function instantiate<T>(cls: ClassConstructor<T>, obj: AnObject): T {
  return plainToInstance(cls, obj, {
    exposeDefaultValues: true,
    enableImplicitConversion: true,

    /**
     * This option requires that each property on the target class has at least one `@Expose` or `@Exclude` decorator
     * assigned from this library.
     * Because we do not want force users to add `@Expose` decorator to each property, the property should be set to `false`,
     */
    excludeExtraneousValues: false,
  });
}
