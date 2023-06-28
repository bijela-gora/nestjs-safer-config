import { Injectable } from "@nestjs/common";
import { GreetingConfig } from "./greeting.config";

@Injectable()
export class GreetingService {
  constructor(private readonly greetingConfig: GreetingConfig) {}

  getGreeting(): string {
    return `Hello ${this.greetingConfig.NAME}!`;
  }
}
