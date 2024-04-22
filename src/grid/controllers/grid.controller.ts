import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GridService } from "../services/grid.service";

@ApiTags("grids")
@Controller("grids")
export class GridController {
  constructor(private gridService: GridService) {}

  @Get("/random")
  async randomGrid() {
    return this.gridService.generateGrid();
  }
}
