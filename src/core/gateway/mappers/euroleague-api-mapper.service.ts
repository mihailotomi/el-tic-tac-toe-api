import { Injectable } from "@nestjs/common";
import { CreateClubDto } from "src/club/dto/create-club.dto";
import { CreatePlayerSeasonDto } from "src/player/dto/create-player-season.dto";
import { GatewayClubDto } from "../dto/gateway-club.dto";
import { GatewayPlayerSeasonDto } from "../dto/gateway-player-season.dto";

@Injectable()
export class EuroleagueApiMapperService {
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
  playerDataToCreateDtoLists = (gatewatPlayerSeasons: GatewayPlayerSeasonDto[]) => {
    const players = [];
    const playerSeasons = [];

    for (const gatewatPlayerSeason of gatewatPlayerSeasons) {
      const [lastName, firstName] = gatewatPlayerSeason.person.name.split(", ");
      if (
        !lastName ||
        !firstName ||
        !gatewatPlayerSeason?.person?.birthDate ||
        !gatewatPlayerSeason.startDate ||
        !gatewatPlayerSeason.endDate
      ) {
        // TODO: store in error log

        continue;
      }

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

      players.push(player);
      playerSeasons.push({ player, playerSeason });
    }

    return { players, playerSeasons };
  };
}
