import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GridService } from "../services/grid.service";
import { CheckPlayerMatchDto } from "../dto/check-player-match.dto";

@ApiTags("grids")
@Controller("grids")
export class GridController {
  constructor(private gridService: GridService) {}

  @Get("/random")
  async randomGrid() {
    return this.gridService.generateGrid();
  }

  @Post("/check-match")
  @UsePipes(new ValidationPipe({ transform: true }))
  async checkPlayerInGrid(@Body() playerMatchDto: CheckPlayerMatchDto): Promise<{
    isMatch: boolean;
  }> {
    return this.gridService.checkMatch(playerMatchDto);
  }
}
