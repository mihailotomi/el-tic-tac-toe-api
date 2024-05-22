import { Injectable } from "@nestjs/common";
import { Player } from "../models/player";
import { PlayerDto } from "../dto/player.dto";

@Injectable()
export class PlayerMapperService {
  toDto = (player: Player): PlayerDto => {
    const playerDto = new PlayerDto();
    Object.assign(playerDto, player);

    return playerDto;
  };
}
