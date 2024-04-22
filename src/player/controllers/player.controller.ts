import { Controller, Get } from "@nestjs/common";
import { PlayerService } from "../services/player.service";

@Controller("players")
export class CatsController {
  constructor(private playerService: PlayerService) {}

  @Get()
  async searchAutocomplete(): Promise<any> {}
}
