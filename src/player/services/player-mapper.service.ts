import { Injectable } from "@nestjs/common";
import { GatewayPlayerSeasonDto } from "src/core/gateway/dto/gateway-player-season.dto";
import { CreatePlayerSeasonDto } from "../dto/create-player-season.dto";
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
