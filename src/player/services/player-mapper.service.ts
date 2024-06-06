import { Injectable } from "@nestjs/common";
import { Player } from "../entities/player";
import { PlayerDto } from "../dto/player.dto";
import { PlayerSeason } from "../entities/playerSeason";
import { PlayerSeasonDto } from "../dto/player-season-dto";

@Injectable()
export class PlayerMapperService {
  playerToDto = (player: Player): PlayerDto => {
    const playerDto = new PlayerDto();
    Object.assign(playerDto, player);

    return playerDto;
  };

  playerSeasonToDto = (playerSeason: PlayerSeason): PlayerSeasonDto => {
    const {
      player: { birthDate, country, imageUrl, ...player },
      club: { code, crestUrl, ...club },
      ...ps
    } = playerSeason;

    return { player, club, ...ps };
  };
}
