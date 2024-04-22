import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { PlayerService } from "../services/player.service";
import { SearchPlayerDto } from "../dto/search-player.dto";

@Controller("players")
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @Get("/search-autocomplete")
  @UsePipes(new ValidationPipe({ transform: true }))
  // @UseInterceptors(ClassSerializerInterceptor)
  async searchAutocomplete(@Query() query: SearchPlayerDto): Promise<any> {
    console.log(query);
    
    return this.playerService.searchAutocomplete(query);
  }
}
