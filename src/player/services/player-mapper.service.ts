import { Injectable } from "@nestjs/common";
import { GatewayPlayerSeasonDto } from "src/core/gateway/dto/gateway-player-season.dto";
import { CreatePlayerSeasonDto } from "../dto/create-player-season.dto";
import { Player } from "../models/player";
import { PlayerDto } from "../dto/player.dto";

@Injectable()
export class PlayerMapperService {
  toDto = (player: Player): PlayerDto => {
    const playerDto = new PlayerDto();
    Object.assign(player, playerDto);

    return playerDto;
  };

  apiToCreateDto = (gatewatPlayerSeason: GatewayPlayerSeasonDto): CreatePlayerSeasonDto => {
    return {
      player: {
        name: gatewatPlayerSeason.person?.name,
        country: gatewatPlayerSeason.person?.country?.code,
        birthDate: new Date(gatewatPlayerSeason.person.birthDate),
        imageUrl: gatewatPlayerSeason.images.headshot,
      },
      playerSeason: {
        startDate: new Date(gatewatPlayerSeason.startDate),
        endDate: new Date(gatewatPlayerSeason.endDate),
        clubCode: gatewatPlayerSeason.club.code,
        seasonName: gatewatPlayerSeason.season.code,
      },
    };
  };
}
