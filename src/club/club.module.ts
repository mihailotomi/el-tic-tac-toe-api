import { Module } from "@nestjs/common";
import { ClubRepository } from "./repository/club.repository";
import { HttpModule } from "@nestjs/axios";
import { DatabaseModule } from "src/core/database/database.module";
import { ClubService } from "./services/club.service";
import { ClubMapperService } from "./services/club-mapper.service";

@Module({
  imports: [HttpModule, DatabaseModule],
  providers: [ClubRepository, ClubService, ClubMapperService],
  exports: [ClubService],
})
export class ClubModule {}
