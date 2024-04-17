import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { RawClubDto } from "../dto/raw-club.dto";

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
          `https://api-live.euroleague.net/v2/competitions/${this.competitionCode}/sesons/${this.competitionCode}${season}/clubs`,
        ),
      );
    } catch (error) {
      throw new HttpException(error.message || "", 400);
    }
  }
}
