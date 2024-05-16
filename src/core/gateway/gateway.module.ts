import { Module } from "@nestjs/common";
import { HttpModule, HttpService } from "@nestjs/axios";
import { EUROCUP_GATEWAY, EUROLEAGUE_GATEWAY } from "./constants/injection-token";
import { EuroleagueApiGatewayProvider } from "./providers/euroleague-api-gateway.provider";
import { ConfigService } from "@nestjs/config";
import { ProballersGatewayProvider } from "./providers/proballers-gateway.provider";
import { ProballersMapperService } from "./mappers/proballers-mapper.service";
import { EuroleagueApiMapperService } from "./mappers/euroleague-api-mapper.service";

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: EUROLEAGUE_GATEWAY,
      useFactory: (httpService: HttpService, mapper: EuroleagueApiMapperService, configService: ConfigService) => {
        return new EuroleagueApiGatewayProvider(httpService, "E", mapper, configService);
      },
      inject: [HttpService, ConfigService, EuroleagueApiMapperService],
    },
    {
      provide: EUROCUP_GATEWAY,
      useFactory: (httpService: HttpService, mapper: EuroleagueApiMapperService, configService: ConfigService) => {
        return new EuroleagueApiGatewayProvider(httpService, "U", mapper, configService);
      },
      inject: [HttpService, ConfigService, EuroleagueApiMapperService],
    },
    ProballersGatewayProvider,
    ProballersMapperService,
    EuroleagueApiMapperService,
  ],
  exports: [EUROLEAGUE_GATEWAY, EUROCUP_GATEWAY, ProballersGatewayProvider],
})
export class GatewayModule {}
