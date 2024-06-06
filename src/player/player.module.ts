import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/core/database/database.module";
import { GatewayModule } from "src/core/gateway/gateway.module";
import { PlayerRepository } from "./repository/player.repository";
import { PlayerMapperService } from "./services/player-mapper.service";
import { PlayerService } from "./services/player.service";
import { PlayerController } from "./controllers/player.controller";
import { ClubModule } from "src/club/club.module";

@Module({
  imports: [DatabaseModule, GatewayModule, ClubModule],
  providers: [PlayerRepository, PlayerMapperService, PlayerService],
  exports: [PlayerService],
  controllers: [PlayerController],
})
export class PlayerModule {}
