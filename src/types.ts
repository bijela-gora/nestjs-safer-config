import type { Type } from "@nestjs/common";

export type AnObject = object; // TypeScript have no way to express a JSON object without index signature

interface JsonArray extends Array<JsonValue> {}

type JsonValue = string | number | boolean | JsonObject | JsonArray | null;

export type JsonObject = { [Key in string]?: JsonValue };

export interface BetterConfigModuleOptions {
  isGlobal?: boolean;
  cls: Type<AnObject>;
  sources: Array<JsonObject | Promise<JsonObject>>;
}
