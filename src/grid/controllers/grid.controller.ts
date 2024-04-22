import { Controller, Get } from "@nestjs/common";
import { GridService } from "../services/grid.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("grids")
@Controller("grids")
export class GridController {
  constructor(private gridService: GridService) {}

  @Get("/random")
  async randomGrid() {
    return this.gridService.generateGrid();
  }
}
