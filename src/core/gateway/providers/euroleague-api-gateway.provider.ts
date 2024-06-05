import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CreateClubDto } from "src/club/dto/create-club.dto";
import { CreatePlayerSeasonDto } from "src/player/dto/create-player-season.dto";
import { CreatePlayerDto } from "src/player/dto/create-player.dto";
import { LOGGER } from "src/core/infrastructure/logging/injection-token";
import { GatewayClubDto } from "../dto/gateway-club.dto";
import { GatewayPlayerSeasonDto } from "../dto/gateway-player-season.dto";
import { EuroleagueApiMapperService } from "../mappers/euroleague-api-mapper.service";

@Injectable({})
export class EuroleagueApiGatewayProvider {
  private baseUrl: string;

  private competitionCode: string = "E";

  constructor(
    private httpService: HttpService,
    private mapper: EuroleagueApiMapperService,
    configService: ConfigService,
    @Inject(LOGGER) private logger: LoggerService,
  ) {
    this.baseUrl = configService.get("EUROLEAGUE_API_URL");
  }

  /**
   * Sends a request to euroleague api to fatch all clubs for a given season
   * @param {number} season
   * @returns {Promise<CreateClubDto[]>} - club persistance entrypoint dto list
   */
  async getClubsForSeason(season: number): Promise<CreateClubDto[]> {
    try {
      const response = await this.httpService.axiosRef<{ data: GatewayClubDto[]; total: number }>({
        url: `${this.baseUrl}/v2/competitions/${this.competitionCode}/seasons/${this.competitionCode}${season}/clubs`,
        method: "GET",
      });

      return response.data.data.map(this.mapper.clubDataToCreateDto);
    } catch (error) {
      this.logger.error(`Clubs error for season: ${season}`);
      this.logger.error(error);
      throw error;
    }
  }

  /**
   * Sends a request to euroleague api to fatch all players for a given season
   * @param {number} season
   * @returns {Promise<{ playerSeasons: CreatePlayerSeasonDto[]; players: CreatePlayerDto[] }>} - player and player season persistance entrypoint dto list
   */
  async getPlayersForSeason(
    season: number,
  ): Promise<{ playerSeasons: CreatePlayerSeasonDto[]; players: CreatePlayerDto[] }> {
    try {
      const response = await this.httpService.axiosRef<{ data: GatewayPlayerSeasonDto[]; total: number }>({
        url: `${this.baseUrl}/v2/competitions/${this.competitionCode}/seasons/${this.competitionCode}${season}/people?personType=J`,
        method: "GET",
      });

      return this.mapper.playerDataToCreateDtoLists(response.data.data);
    } catch (error) {
      this.logger.error(`Players error for season: ${season}`);
      this.logger.error(error);
      throw error;
    }
  }
}
