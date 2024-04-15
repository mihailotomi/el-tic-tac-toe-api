import { ConsoleLogger, Module, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { PlayerModule } from "./player/player.module";
import { ClubModule } from "./club/club.module";
import { DatabaseModule } from "./core/database/database.module";
import { ClubService } from "./club/services/club.service";

@Module({
  imports: [
    PlayerModule,
    ClubModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".development.env" }),
    DatabaseModule,
  ],
  controllers: [],
  providers: [ConsoleLogger],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private clubService: ClubService) {}

  async onApplicationBootstrap() {
    await this.clubService.populateClubs();
  }
}
