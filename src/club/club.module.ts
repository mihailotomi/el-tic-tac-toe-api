import { Module } from "@nestjs/common";
import { ClubRepository } from "./repository/club.repository";
import { HttpModule } from "@nestjs/axios";
import { DatabaseModule } from "src/core/database/database.module";
import { ClubService } from "./services/club.service";
import { ClubMapperService } from "./services/club-mapper.service";
import { GatewayModule } from "src/core/gateway/gateway.module";

@Module({
  imports: [DatabaseModule, GatewayModule],
  providers: [ClubRepository, ClubService, ClubMapperService],
  exports: [ClubService],
})
export class ClubModule {}
