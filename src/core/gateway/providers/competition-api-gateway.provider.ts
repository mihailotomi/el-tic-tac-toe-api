import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { GatewayClubDto } from "../dto/gateway-club.dto";
import { GatewayPlayerSeasonDto } from "../dto/gateway-player-season.dto";

@Injectable()
export class CompetitionApiGatewayProvider {
  constructor(
    private httpService: HttpService,
    private competitionCode: string,
  ) {}

  getClubsForSeason(season: number) {
    try {
      return firstValueFrom(
        this.httpService.get<{ data: GatewayClubDto[]; total: number }>(
          `/competitions/${this.competitionCode}/seasons/${this.competitionCode}${season}/clubs`,
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
          `/competitions/${this.competitionCode}/seasons/${this.competitionCode}${season}/people?personType=J`,
        ),
      );
    } catch (error) {
      // TODO: throw custom exception
      throw new HttpException(error?.message || "", 400);
    }
  }
}
