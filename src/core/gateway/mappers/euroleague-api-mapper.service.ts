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
   * Map gateway player season into a dto for storing the player and his season
   * @param {GatewayPlayerSeasonDto} gatewatPlayerSeason
   * @returns {CreatePlayerSeasonDto}
   */
  playerDataToCreateDto = (gatewatPlayerSeason: GatewayPlayerSeasonDto): CreatePlayerSeasonDto => {
    const [lastName, firstName] = gatewatPlayerSeason.person.name.split(", ");

    return {
      player: {
        firstName,
        lastName,
        country: gatewatPlayerSeason.person?.country?.code,
        birthDate: gatewatPlayerSeason.person.birthDate,
        imageUrl: gatewatPlayerSeason?.images && gatewatPlayerSeason.images?.headshot,
      },
      playerSeason: {
        startDate: new Date(gatewatPlayerSeason.startDate),
        endDate: new Date(gatewatPlayerSeason.endDate),
        clubCode: gatewatPlayerSeason.club.code,
        season: gatewatPlayerSeason.season.year,
      },
    };
  };
}
