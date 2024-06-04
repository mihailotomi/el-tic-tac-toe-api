import { HttpService } from "@nestjs/axios";
import { HttpException, Inject, Injectable, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { ProballersMapperService } from "../mappers/proballers-mapper.service";
import { ProballersPlayerIntermediateDto } from "../dto/proballers-player-intermediate.dto";
import { CreatePlayerSeasonDto } from "src/player/dto/create-player-season.dto";
import { CreatePlayerDto } from "src/player/dto/create-player.dto";
import clubUris from "../data/club-uris.json";
import { LOGGER } from "src/core/infrastructure/logging/injection-token";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

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
      return null;
    }
    const playersIntermediateDtoList = await this.getIntermediateDtoList(clubUris[clubCode], clubCode);
    const playerDtoList = [];
    const playerSeasonDtoList = [];

    for (const dto of playersIntermediateDtoList) {
      const data = await this.getPlayerSeasonDetails(dto);
      const errors = await validate(plainToInstance(CreatePlayerDto, data.player));

      if (!errors.length) {
        playerDtoList.push(data.player);
        for (let ps of data.playerSeasons) {
          playerSeasonDtoList.push(ps);
        }
      } else {
        this.logger.error(JSON.stringify(data));
        this.logger.error(`Error for player: ${data.player && data.player.firstName} ${data.player && data.player.lastName}`);
        this.logger.error(errors);
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
      return this.mapper.playerDataToCreateDto(response.data, seasons, clubCode);
    } catch (error) {
      this.logger.error(`Error for player: ${playerUrl}`);
      this.logger.error(error.message || error.error.message);
      return null;
    }
  };
}
