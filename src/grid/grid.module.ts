import { Module } from "@nestjs/common";
import { GridService } from "./services/grid.service";
import { ClubModule } from "src/club/club.module";

@Module({
  providers: [GridService],
  imports: [ClubModule],
})
export class GridModule {}
