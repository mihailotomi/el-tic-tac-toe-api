import { CommandFactory } from "nest-commander";
import { AppModule } from "src/app.module";

const bootstrap = async () => {
  await CommandFactory.run(AppModule);
};

bootstrap();
