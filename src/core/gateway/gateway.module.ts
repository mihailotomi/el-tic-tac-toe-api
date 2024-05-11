import { Module } from "@nestjs/common";
import { HttpModule, HttpService } from "@nestjs/axios";
import { EUROCUP_GATEWAY, EUROLEAGUE_GATEWAY } from "./constants/injection-token";
import { EuroleagueApiGatewayProvider } from "./providers/euroleague-api-gateway.provider";
import { ConfigService } from "@nestjs/config";
import { ProballersGatewayProvider } from "./providers/proballers-gateway.provider";

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: EUROLEAGUE_GATEWAY,
      useFactory: (httpService: HttpService, configService: ConfigService) => {
        return new EuroleagueApiGatewayProvider(httpService, "E", configService);
      },
      inject: [HttpService],
    },
    {
      provide: EUROCUP_GATEWAY,
      useFactory: (httpService: HttpService, configService: ConfigService) => {
        return new EuroleagueApiGatewayProvider(httpService, "U", configService);
      },
      inject: [HttpService],
    },
    ProballersGatewayProvider,
  ],
  exports: [EUROLEAGUE_GATEWAY, EUROCUP_GATEWAY, ProballersGatewayProvider],
})
export class GatewayModule {}
