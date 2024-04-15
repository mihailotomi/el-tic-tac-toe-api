import { Global, Module } from "@nestjs/common";
import { HttpExceptionFilter } from "./exceptions/filters/HttpExceptionFilter";

@Global()
@Module({})
export class InfrastructureModule {
  providers: [HttpExceptionFilter];
  exports: [HttpExceptionFilter];
}
