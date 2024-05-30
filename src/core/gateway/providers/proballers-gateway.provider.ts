import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { ProballersMapperService } from "../mappers/proballers-mapper.service";
import { ProballersPlayerIntermediateDto } from "../dto/proballers-player-intermediate.dto";
import { CreatePlayerSeasonDto } from "src/player/dto/create-player-season.dto";

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

  /**
   * Sends a request to proballers team historic roster and parses intermediate player dto
   * @param {number} clubUri - proballers URI of the club
   * @param {string} clubCode - code of the club
   * @returns {Promise<ProballersPlayerIntermediateDto[]>}
   */
  getClubHistoricRoster = async (clubUri: string, clubCode: string): Promise<ProballersPlayerIntermediateDto[]> => {
    try {
      const response = await firstValueFrom(
        this.httpService.get<string>(`${this.baseUrl}/basketball/team/${clubUri}/all-time-roster`, {
          headers: { Accept: "text/html" },
        }),
      );
      return this.mapper.playerListRawToIntermediateDto(response.data, clubCode);
    } catch (error) {
      // TODO: throw custom exception
      throw new HttpException(error?.message || "", 400);
    }
  };

  /**
   * Sends a request to proballers team historic roster and parses intermediate player dto
   * @param {ProballersPlayerIntermediateDto} dto
   * @returns {Promise<CreatePlayerSeasonDto[]>}
   */
  getPlayerSeasonDetails = async ({
    playerUrl,
    seasons,
    clubCode,
  }: ProballersPlayerIntermediateDto): Promise<CreatePlayerSeasonDto[]> => {
    try {
      const response = await firstValueFrom(
        this.httpService.get<string>(`${this.baseUrl}${playerUrl}`, {
          headers: { Accept: "text/html" },
        }),
      );
      return this.mapper.playerDataToCreateDto(response.data, seasons, clubCode);
    } catch (error) {
      // TODO: throw custom exception
      console.log("Error with: " + playerUrl);

      // throw new HttpException(error?.message || "", 400);
    }
  };
}
