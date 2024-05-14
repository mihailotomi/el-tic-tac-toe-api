import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { ProballersMapperService } from "../mappers/proballers-mapper.service";
import { ProballersPlayerIntermediateDto } from "../dto/proballers-player-intermediate.dto";

@Injectable()
export class ProballersGatewayProvider {
  private baseUrl: string;

  constructor(
    private httpService: HttpService,
    private mapper: ProballersMapperService,
    private configService: ConfigService,
  ) {
    this.baseUrl = configService.get("PROBALLERS_URL");
  }

  getClubHistoricRoster = async (pbId: number, clubFullName: string): Promise<ProballersPlayerIntermediateDto[]> => {
    try {
      const response = await firstValueFrom(
        this.httpService.get<string>(`${this.baseUrl}/basketball/team/${pbId}/${clubFullName}/all-time-roster`, {
          headers: { Accept: "text/html" },
        }),
      );
      return this.mapper.playerListRawToIntermediateDto(response.data);
    } catch (error) {
      // TODO: throw custom exception
      throw new HttpException(error?.message || "", 400);
    }
  };

  getPlayerSeasonDetails = async ({ playerUrl, season }: ProballersPlayerIntermediateDto) => {
    try {
      const seasonUri = season === +this.configService.get("CURRENT_SEASON") ? "games" : `games/${season}`;
      const response = await firstValueFrom(
        this.httpService.get<string>(`${this.baseUrl}${playerUrl}/${seasonUri}`, {
          headers: { Accept: "text/html" },
        }),
      );
      return this.mapper.playerDataToCreateDto(response.data, season);
    } catch (error) {
      // TODO: throw custom exception
      console.log(error);
      
      // throw new HttpException(error?.message || "", 400);
    }
  };
}
