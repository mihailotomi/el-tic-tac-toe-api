import { ConsoleLogger, DynamicModule, Module } from "@nestjs/common";
import { HttpExceptionFilter } from "./exceptions/filters/HttpExceptionFilter";
import { FileLogger } from "./logging/file.logger";
import { LoggingOptions } from "./logging/logging-options.interface";
import { LOGGER } from "./logging/injection-token";

@Module({})
export class InfrastructureModule {
  static register(options: { logging: LoggingOptions }): DynamicModule {
    const loggingProvider = {
      provide: LOGGER,
      useValue: options.logging.useFile ? new FileLogger(options.logging.filePath) : new ConsoleLogger(),
    };

    return {
      module: InfrastructureModule,
      providers: [HttpExceptionFilter, loggingProvider],
      exports: [HttpExceptionFilter, loggingProvider],
    };
  }
}
