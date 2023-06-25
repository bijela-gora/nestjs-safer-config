import { Module } from "@nestjs/common";
import { GreetingService } from "./greeting.service";
import { GreetingConfig } from "./greeting.config";
import { GreetingController } from "./greeting.controller";
import { SaferConfigModule } from "nestjs-safer-config";

@Module({
  imports: [
    SaferConfigModule.register({
      createInstanceOf: GreetingConfig,
      sources: [process.env],
    }),
  ],
  controllers: [GreetingController],
  providers: [GreetingService],
})
export class GreetingModule {}
