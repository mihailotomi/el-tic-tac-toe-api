import { Injectable } from "@nestjs/common";
import { RawPlayerSeasonDto } from "src/core/gateway/dto/raw-player-season.dto";
import { CreatePlayerSeasonDto } from "../dto/create-player-season.dto";

@Injectable()
export class PlayerMapperService {
  mapFromRaw = (rawPlayerSeason: RawPlayerSeasonDto): CreatePlayerSeasonDto => {
    return {
      player: {
        name: rawPlayerSeason.person?.name,
        country: rawPlayerSeason.person?.country?.code,
        birthDate: new Date(rawPlayerSeason.person.birthDate),
        imageUrl: rawPlayerSeason.images.headshot,
      },
      playerSeason: {
        startDate: new Date(rawPlayerSeason.startDate),
        endDate: new Date(rawPlayerSeason.endDate),
        clubCode: rawPlayerSeason.club.code,
        seasonName: rawPlayerSeason.season.code,
      },
    };
  };
}
