import { Injectable } from "@nestjs/common";
import { ApiPlayerSeasonDto } from "src/core/gateway/dto/api-player-season.dto";
import { CreatePlayerSeasonDto } from "../dto/create-player-season.dto";
import { Player } from "../models/player";
import { RawPlayerDto } from "../dto/raw-player.dto";

@Injectable()
export class PlayerMapperService {
  fromRaw = (rawPlayer: RawPlayerDto): Player => {
    const player = new Player();
    Object.assign(player, rawPlayer);
    
    return player;
  };

  apiToCreateDto = (apiPlayerSeason: ApiPlayerSeasonDto): CreatePlayerSeasonDto => {
    return {
      player: {
        name: apiPlayerSeason.person?.name,
        country: apiPlayerSeason.person?.country?.code,
        birthDate: new Date(apiPlayerSeason.person.birthDate),
        imageUrl: apiPlayerSeason.images.headshot,
      },
      playerSeason: {
        startDate: new Date(apiPlayerSeason.startDate),
        endDate: new Date(apiPlayerSeason.endDate),
        clubCode: apiPlayerSeason.club.code,
        seasonName: apiPlayerSeason.season.code,
      },
    };
  };
}
