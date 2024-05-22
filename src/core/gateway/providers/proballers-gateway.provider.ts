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
   * @param {number} pbId - proballers id of the club
   * @param {string} clubFullName - proballers full name of the club
   * @returns {Promise<ProballersPlayerIntermediateDto[]>}
   */
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

  /**
   * Sends a request to proballers team historic roster and parses intermediate player dto
   * @param {Object} dto
   * @param {string} dto.playerUrl - url for the player page
   * @param {number[]} dto.seasons - list of seasons player spent at the club
   * @returns {Promise<CreatePlayerSeasonDto[]>}
   */
  getPlayerSeasonDetails = async ({
    playerUrl,
    seasons,
  }: ProballersPlayerIntermediateDto): Promise<CreatePlayerSeasonDto[]> => {
    try {
      const response = await firstValueFrom(
        this.httpService.get<string>(`${this.baseUrl}${playerUrl}`, {
          headers: { Accept: "text/html" },
        }),
      );
      return this.mapper.playerDataToCreateDto(response.data, seasons);
    } catch (error) {
      // TODO: throw custom exception
      console.log(error);

      // throw new HttpException(error?.message || "", 400);
    }
  };
}
