import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { CreateClubDto } from "src/club/dto/create-club.dto";
import { LOGGER } from "src/core/infrastructure/logging/injection-token";
import { GatewayClubDto } from "../dto/gateway-club.dto";
import { GatewayPlayerSeasonDto } from "../dto/gateway-player-season.dto";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { CreatePlayerDto } from "src/player/dto/create-player.dto";
import { CreatePlayerSeasonDto } from "src/player/dto/create-player-season.dto";

@Injectable()
export class EuroleagueApiMapperService {
  constructor(@Inject(LOGGER) private logger: LoggerService) {}

  /**
   * Map gateway club payload to a creation suitable dto
   * @param {GatewayClubDto} gatewayClub
   * @returns {CreateClubDto}
   */
  clubDataToCreateDto = (gatewayClub: GatewayClubDto): CreateClubDto => {
    return {
      name: gatewayClub.name,
      code: gatewayClub.code,
      crestUrl: gatewayClub?.images?.crest,
    };
  };

  /**
   * Map gateway player seasons into a lists of player and player season create dtos
   * @param {GatewayPlayerSeasonDto[]} gatewatPlayerSeasons
   */
  playerDataToCreateDtoLists = async (
    gatewatPlayerSeasons: GatewayPlayerSeasonDto[],
  ): Promise<{
    players: CreatePlayerDto[];
    playerSeasons: CreatePlayerSeasonDto[];
  }> => {
    const players = [];
    const playerSeasons = [];

    for (const gatewatPlayerSeason of gatewatPlayerSeasons) {
      const [lastName, firstName] = gatewatPlayerSeason.person.name.split(", ");

      const player = {
        firstName,
        lastName,
        country: gatewatPlayerSeason.person?.country?.code,
        birthDate: gatewatPlayerSeason.person.birthDate,
        imageUrl: gatewatPlayerSeason?.images && gatewatPlayerSeason.images?.headshot,
      };
      const playerSeason = {
        startDate: gatewatPlayerSeason.startDate,
        endDate: gatewatPlayerSeason.endDate,
        clubCode: gatewatPlayerSeason.club.code,
        season: gatewatPlayerSeason.season.year,
      };

      const playerErrors = await validate(plainToInstance(CreatePlayerDto, player));
      if (playerErrors) {
        throw playerErrors;
      }

      players.push(player);
      playerSeasons.push({ player, playerSeason });
    }

    return { players, playerSeasons };
  };
}
