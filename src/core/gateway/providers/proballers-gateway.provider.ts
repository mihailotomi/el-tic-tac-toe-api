import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { ProballersPlayerSeasonDto } from "../dto/proballers-player-season.dto";

@Injectable()
export class ProballersGatewayProvider {
  private baseUrl: string;

  constructor(
    private httpService: HttpService,
    configService: ConfigService,
  ) {
    this.baseUrl = configService.get("PROBALLERS_URL");
  }

  //   searchClubsByName;

  getClubHistoricRoster(pbId: number, clubFullName: string) {
    try {
      return firstValueFrom(
        this.httpService.get<any>(
          this.baseUrl + `/team/${pbId}/${clubFullName}/all-time-roster`,
        ),
      );
    } catch (error) {
      // TODO: throw custom exception
      throw new HttpException(error?.message || "", 400);
    }
  }
}
