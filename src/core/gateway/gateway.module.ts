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
        baseURL: ((configService.get("EUROLEAGUE_API_URL") as string) +
          configService.get("EUROLEAGUE_API_VERSION")) as string,
      }),
    }),
  ],
  providers: [
    {
      provide: EUROLEAGUE_GATEWAY,
      useFactory: (httpService: HttpService) => {
        return new CompetitionApiGatewayProvider(httpService, "E");
      },
      inject: [HttpService],
    },
    {
      provide: EUROCUP_GATEWAY,
      useFactory: (httpService: HttpService) => {
        return new CompetitionApiGatewayProvider(httpService, "U");
      },
      inject: [HttpService],
    },
  ],
  exports: [EUROLEAGUE_GATEWAY, EUROCUP_GATEWAY],
})
export class GatewayModule {}
