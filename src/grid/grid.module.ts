import { Module } from "@nestjs/common";
import { ClubModule } from "src/club/club.module";
import { GridService } from "./services/grid.service";
import { GridController } from "./controllers/grid.controller";

@Module({
  providers: [GridService],
  imports: [ClubModule],
  controllers: [GridController],
})
export class GridModule {}
