import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { EuroleagueApiGatewayProvider } from "./providers/euroleague-api-gateway.provider";
import { ProballersGatewayProvider } from "./providers/proballers-gateway.provider";
import { ProballersMapperService } from "./mappers/proballers-mapper.service";
import { EuroleagueApiMapperService } from "./mappers/euroleague-api-mapper.service";
import { NationalityMapperService } from "./mappers/nationality-mapper.service";
import { InfrastructureModule } from "../infrastructure/infrastructure.module";

@Module({
  imports: [HttpModule, InfrastructureModule.register({ logging: { useFile: true, filePath: "logs/gateway.log" } })],
  providers: [
    EuroleagueApiGatewayProvider,
    ProballersGatewayProvider,
    ProballersMapperService,
    EuroleagueApiMapperService,
    NationalityMapperService,
  ],
  exports: [EuroleagueApiGatewayProvider, ProballersGatewayProvider],
})
export class GatewayModule {}
