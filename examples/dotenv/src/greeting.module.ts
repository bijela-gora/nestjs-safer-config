import { SaferConfigModule, tryParseDotenvFile } from "nestjs-safer-config";
import { Module } from "@nestjs/common";

import { GreetingService } from "./greeting.service";
import { GreetingConfig } from "./greeting.config";
import { GreetingController } from "./greeting.controller";

@Module({
  imports: [
    SaferConfigModule.register({
      createInstanceOf: GreetingConfig,
      sources: [tryParseDotenvFile(".env")],
    }),
  ],
  controllers: [GreetingController],
  providers: [GreetingService],
})
export class GreetingModule {}
