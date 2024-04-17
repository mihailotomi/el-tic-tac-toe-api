import { Module } from "@nestjs/common";
import { HttpModule, HttpService } from "@nestjs/axios";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EUROCUP_GATEWAY, EUROLEAGUE_GATEWAY } from "./constants/injection-token";
import { CompetitionApiGatewayProvider } from "./providers/competition-api-gateway.provider";

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get("EUROLEAGUE_API_URL") + configService.get("EUROLEAGUE_API_VERSION"),
      }),
    }),
  ],
  providers: [
    {
      provide: EUROLEAGUE_GATEWAY,
      useFactory: (httpService: HttpService, competitionCode: string) => {
        return new CompetitionApiGatewayProvider(httpService, competitionCode);
      },
      inject: [HttpService, "E"],
    },
    {
      provide: EUROCUP_GATEWAY,
      useFactory: (httpService: HttpService, competitionCode: string) => {
        return new CompetitionApiGatewayProvider(httpService, competitionCode);
      },
      inject: [HttpService, "U"],
    },
  ],
  exports: [EUROLEAGUE_GATEWAY, EUROCUP_GATEWAY],
})
export class GatewayModule {}
