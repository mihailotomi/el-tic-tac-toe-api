import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { GatewayClubDto } from "../dto/gateway-club.dto";
import { GatewayPlayerSeasonDto } from "../dto/gateway-player-season.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EuroleagueApiGatewayProvider {
  private baseUrl: string;

  constructor(
    private httpService: HttpService,
    private competitionCode: string,
    configService: ConfigService,
  ) {
    this.baseUrl = configService.get("EUROLEAGUE_API_URL");
  }

  getClubsForSeason(season: number) {
    try {
      return firstValueFrom(
        this.httpService.get<{ data: GatewayClubDto[]; total: number }>(
          this.baseUrl + `/competitions/${this.competitionCode}/seasons/${this.competitionCode}${season}/clubs`,
        ),
      );
    } catch (error) {
      // TODO: throw custom exception
      throw new HttpException(error?.message || "", 400);
    }
  }

  getPlayersForSeason(season: number) {
    try {
      return firstValueFrom(
        this.httpService.get<{ data: GatewayPlayerSeasonDto[]; total: number }>(
          this.baseUrl +
            `/competitions/${this.competitionCode}/seasons/${this.competitionCode}${season}/people?personType=J`,
        ),
      );
    } catch (error) {
      // TODO: throw custom exception
      throw new HttpException(error?.message || "", 400);
    }
  }
}
