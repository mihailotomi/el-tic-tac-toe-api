import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import { Club } from "src/club/entities/club";
import { PlayerService } from "../services/player.service";
import { SearchPlayerDto } from "../dto/search-player.dto";
import { Player } from "../entities/player";
import { CheckPlayerMatchDto } from "../dto/check-player-match.dto";
import { PlayerSeasonDto } from "../dto/player-season-dto";

@ApiTags("players")
@Controller("players")
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @Get("/search-autocomplete")
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  searchAutocomplete(@Query() query: SearchPlayerDto): Promise<Player[]> {
    return this.playerService.searchAutocomplete(query);
  }

  @Get("/:id/club-history")
  @ApiParam({ name: "id", required: true })
  getPlayerSeasons(@Param("id") id: string): Promise<PlayerSeasonDto[]> {
    return this.playerService.getPlayerSeasons(+id);
  }

  @Get("/check-match")
  @UsePipes(new ValidationPipe({ transform: true }))
  checkMatch(@Query() query: CheckPlayerMatchDto) {
    return this.playerService.checkMatch(query);
  }
}
