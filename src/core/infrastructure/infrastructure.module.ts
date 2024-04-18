import { ConsoleLogger, Global, Module } from "@nestjs/common";
import { HttpExceptionFilter } from "./exceptions/filters/HttpExceptionFilter";

@Global()
@Module({ providers: [HttpExceptionFilter, ConsoleLogger], exports: [HttpExceptionFilter] })
export class InfrastructureModule {}
