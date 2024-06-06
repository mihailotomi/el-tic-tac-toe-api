import { Module } from "@nestjs/common";
import { ClubModule } from "src/club/club.module";
import { GridService } from "./services/grid.service";
import { GridController } from "./controllers/grid.controller";
import { PlayerModule } from "src/player/player.module";

@Module({
  providers: [GridService],
  imports: [ClubModule, PlayerModule],
  controllers: [GridController],
})
export class GridModule {}
