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
    configService: ConfigService,
  ) {
    this.baseUrl = configService.get("PROBALLERS_URL");
  }

  async getClubHistoricRoster(pbId: number, clubFullName: string): Promise<ProballersPlayerIntermediateDto[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<any>(`${this.baseUrl}/basketball/team/${pbId}/${clubFullName}/all-time-roster`, {
          headers: { Accept: "text/html" },
        }),
      );
      return this.mapper.playerListRawToIntermediateDto(response.data);
    } catch (error) {
      // TODO: throw custom exception
      throw new HttpException(error?.message || "", 400);
    }
  }

  async getPlayerSeasonDetails({playerUrl}: ProballersPlayerIntermediateDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.get<any>(`${this.baseUrl}player/${playerUrl}`, {
          headers: { Accept: "text/html" },
        }),
      );
      return response.data;
    } catch (error) {
      // TODO: throw custom exception
      throw new HttpException(error?.message || "", 400);
    }
  }
}
