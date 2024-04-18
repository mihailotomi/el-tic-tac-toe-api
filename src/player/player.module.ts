import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/core/database/database.module";
import { GatewayModule } from "src/core/gateway/gateway.module";
import { PlayerRepository } from "./repository/player.repository";
import { PlayerMapperService } from "./services/player-mapper.service";
import { PlayerService } from "./services/player.service";

@Module({
  imports: [DatabaseModule, GatewayModule],
  providers: [PlayerRepository, PlayerMapperService, PlayerService],
  exports: [PlayerService],
})
export class PlayerModule {}
