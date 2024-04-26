import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PlayerService } from "../services/player.service";
import { SearchPlayerDto } from "../dto/search-player.dto";
import { Player } from "../models/player";
import { CheckPlayerMatchDto } from "../dto/check-player-match.dto";

@ApiTags("players")
@Controller("players")
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @Get("/search-autocomplete")
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  async searchAutocomplete(@Query() query: SearchPlayerDto): Promise<Player[]> {
    return this.playerService.searchAutocomplete(query);
  }

  @Get("/check-match")
  @UsePipes(new ValidationPipe({ transform: true }))
  async checkMatch(@Query() query: CheckPlayerMatchDto) {
    return this.playerService.checkMatch(query);
  }
}
