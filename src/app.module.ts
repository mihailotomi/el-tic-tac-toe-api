import { ConsoleLogger, Module, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { PlayerModule } from "./player/player.module";
import { ClubModule } from "./club/club.module";
import { DatabaseModule } from "./core/database/database.module";
import { ClubService } from "./club/services/club.service";
import { PlayerService } from "./player/services/player.service";
import { InfrastructureModule } from "./core/infrastructure/infrastructure.module";

@Module({
  imports: [
    PlayerModule,
    ClubModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".development.env" }),
    DatabaseModule,
    InfrastructureModule
  ],
  controllers: [],
  providers: [ConsoleLogger],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    private logger: ConsoleLogger,
    private clubService: ClubService,
    private playerService: PlayerService,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log("Populating clubs...")
    // await this.clubService.populateClubs();
    this.logger.log("Successfully populated clubs...")

    this.logger.log("Populating players...")
    await this.playerService.populatePlayers();
    this.logger.log("Successfully populated players...")

  }
}
