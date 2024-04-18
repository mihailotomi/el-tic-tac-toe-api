import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./core/infrastructure/exceptions/filters/HttpExceptionFilter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ["error", "warn"] });

  const exceptionFilter: HttpExceptionFilter = app.get(HttpExceptionFilter);
  app.useGlobalFilters(exceptionFilter);

  await app.listen(3000);
}
bootstrap();
