import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { CreatePlayerSeasonDto } from "src/player/dto/create-player-season.dto";
import { CreatePlayerDto } from "src/player/dto/create-player.dto";
import { LOGGER } from "src/core/infrastructure/logging/injection-token";
import clubUris from "../data/club-uris.json";
import { ProballersPlayerIntermediateDto } from "../dto/proballers-player-intermediate.dto";
import { ProballersMapperService } from "../mappers/proballers-mapper.service";

@Injectable()
export class ProballersGatewayProvider {
  private baseUrl: string;

  constructor(
    private httpService: HttpService,
    private mapper: ProballersMapperService,
    configService: ConfigService,
    @Inject(LOGGER) private logger: LoggerService,
  ) {
    this.baseUrl = configService.get("PROBALLERS_URL");
  }

  getClubHistoricRoster = async (
    clubCode: string,
  ): Promise<{ playerSeasonDtoList: CreatePlayerSeasonDto[]; playerDtoList: CreatePlayerDto[] } | null> => {
    if (!clubUris[clubCode]) {
      throw new Error("Non existent club code!");
    }
    const playersIntermediateDtoList = await this.getIntermediateDtoList(clubUris[clubCode], clubCode);
    const playerDtoList = [];
    const playerSeasonDtoList = [];

    for (const dto of playersIntermediateDtoList) {
      // eslint-disable-next-line no-await-in-loop
      const data = await this.getPlayerSeasonDetails(dto);

      if (data) {
        playerDtoList.push(data.player);
        for (const ps of data.playerSeasons) {
          playerSeasonDtoList.push(ps);
        }
      }
    }

    return {
      playerDtoList,
      playerSeasonDtoList,
    };
  };

  /**
   * Sends a request to proballers team historic roster and parses intermediate player dto
   * @param {number} clubUri - proballers URI of the club
   * @param {string} clubCode - code of the club
   * @returns {Promise<ProballersPlayerIntermediateDto[]>}
   */
  private getIntermediateDtoList = async (
    clubUri: string,
    clubCode: string,
  ): Promise<ProballersPlayerIntermediateDto[]> => {
    try {
      const response = await firstValueFrom(
        this.httpService.get<string>(`${this.baseUrl}/basketball/team/${clubUri}/all-time-roster`, {
          headers: { Accept: "text/html" },
        }),
      );
      return this.mapper.playerListRawToIntermediateDto(response.data, clubCode);
    } catch (error) {
      this.logger.error(`Error for club: ${clubCode}`);
      this.logger.error(error);
      throw error;
    }
  };

  /**
   * Sends a request to proballers team historic roster and parses intermediate player dto
   * @param {ProballersPlayerIntermediateDto} dto
   * @returns {Promise<CreatePlayerSeasonDto[]>}
   */
  private getPlayerSeasonDetails = async ({
    playerUrl,
    seasons,
    clubCode,
  }: ProballersPlayerIntermediateDto): Promise<{
    playerSeasons: CreatePlayerSeasonDto[];
    player: CreatePlayerDto;
  } | null> => {
    try {
      const response = await firstValueFrom(
        this.httpService.get<string>(`${this.baseUrl}${playerUrl}`, {
          headers: { Accept: "text/html" },
        }),
      );
      return await this.mapper.playerDataToCreateDto(response.data, seasons, clubCode);
    } catch (error) {
      this.logger.error(`Error for player: ${playerUrl}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.logger.error(error);
      return null;
    }
  };
}
