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
import { PlayerService } from "../services/player.service";
import { SearchPlayerDto } from "../dto/search-player.dto";
import { Player } from "../models/player";
import { CheckPlayerMatchDto } from "../dto/check-player-match.dto";
import { Club } from "src/club/models/club";

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
  getClubHistory(@Param("id") id: string): Promise<Club[]> {
    return this.playerService.getPlayerClubHistory(+id);
  }

  @Get("/check-match")
  @UsePipes(new ValidationPipe({ transform: true }))
  checkMatch(@Query() query: CheckPlayerMatchDto) {
    return this.playerService.checkMatch(query);
  }
}
