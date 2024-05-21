import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "@nestjs/config";
import { CreateClubDto } from "src/club/dto/create-club.dto";
import { CreatePlayerSeasonDto } from "src/player/dto/create-player-season.dto";
import { GatewayClubDto } from "../dto/gateway-club.dto";
import { GatewayPlayerSeasonDto } from "../dto/gateway-player-season.dto";
import { EuroleagueApiMapperService } from "../mappers/euroleague-api-mapper.service";

@Injectable()
export class EuroleagueApiGatewayProvider {
  private baseUrl: string;

  private competitionCode: string = "E";

  constructor(
    private httpService: HttpService,
    private mapper: EuroleagueApiMapperService,
    configService: ConfigService,
  ) {
    this.baseUrl = configService.get("EUROLEAGUE_API_URL");
  }

  async getClubsForSeason(season: number): Promise<CreateClubDto[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<{ data: GatewayClubDto[]; total: number }>(
          `${this.baseUrl  }/competitions/${this.competitionCode}/seasons/${this.competitionCode}${season}/clubs`,
        ),
      );

      return response.data.data.map(this.mapper.clubDataToCreateDto);
    } catch (error) {
      // TODO: throw custom exception
      throw new HttpException(error?.message || "", 400);
    }
  }

  async getPlayersForSeason(season: number): Promise<CreatePlayerSeasonDto[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<{ data: GatewayPlayerSeasonDto[]; total: number }>(
          `${this.baseUrl 
            }/competitions/${this.competitionCode}/seasons/${this.competitionCode}${season}/people?personType=J`,
        ),
      );

      return response.data.data.map(this.mapper.playerDataToCreateDto);
    } catch (error) {
      // TODO: throw custom exception
      throw new HttpException(error?.message || "", 400);
    }
  }
}
