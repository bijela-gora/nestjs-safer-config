import { IsString } from "class-validator";

export class GreetingConfig {
  @IsString()
  readonly NAME: string;
}
