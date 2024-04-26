import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./core/infrastructure/exceptions/filters/HttpExceptionFilter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ["error", "warn"] });

  const exceptionFilter: HttpExceptionFilter = app.get(HttpExceptionFilter);
  app.useGlobalFilters(exceptionFilter);

  const config = new DocumentBuilder()
    .setTitle("Euroleague tic-tac-toe")
    .setDescription("A tic-tac-toe with Euroleague players")
    .setVersion("1.0")
    .addTag("players", "grids")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document); 

  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
