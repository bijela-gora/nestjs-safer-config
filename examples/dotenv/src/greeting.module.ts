import * as path from "path";
import * as fs from "fs";
import { parse } from "dotenv";
import { SaferConfigModule } from "nestjs-safer-config";
import { Module } from "@nestjs/common";

import { GreetingService } from "./greeting.service";
import { GreetingConfig } from "./greeting.config";
import { GreetingController } from "./greeting.controller";

function tryParseDotenvFile(filePath: string): unknown {
  return parse(fs.readFileSync(path.resolve(filePath), "utf-8"));
}

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
