import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { RawClubDto } from "../dto/raw-club.dto";
import { RawPlayerSeasonDto } from "../dto/raw-player-season.dto";

@Injectable()
export class CompetitionApiGatewayProvider {
  constructor(
    private httpService: HttpService,
    private competitionCode: string,
  ) {}

  getClubsForSeason(season: number) {
    try {
      return firstValueFrom(
        this.httpService.get<{ data: RawClubDto[]; total: number }>(
          `/competitions/${this.competitionCode}/seasons/${this.competitionCode}${season}/clubs`,
        ),
      );
    } catch (error) {
      // TODO: throw custom exception
      throw new HttpException(error.message || "", 400);
    }
  }

  getPlayersForSeason(season: number){
    try {
      return firstValueFrom(
        this.httpService.get<{ data: RawPlayerSeasonDto[]; total: number }>(
          `/competitions/${this.competitionCode}/seasons/${this.competitionCode}${season}/people?personType=J`,
        ),
      );
    } catch (error) {
      // TODO: throw custom exception
      throw new HttpException(error.message || "", 400);
    }
  }
}
