import { NestFactory } from "@nestjs/core";
import { GreetingModule } from "./greeting.module";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(GreetingModule);
  await app.listen(3000);
}
void bootstrap();
