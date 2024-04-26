import { ConsoleLogger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { PlayerModule } from "./player/player.module";
import { ClubModule } from "./club/club.module";
import { DatabaseModule } from "./core/database/database.module";

import { InfrastructureModule } from "./core/infrastructure/infrastructure.module";
import { GridModule } from "./grid/grid.module";
import { SeedPlayersCommand } from "./cli/commands/seed-players.command";
import { EuroleagueApiSeedCommand } from "./cli/commands/euroleague-api-seed.command";

@Module({
  imports: [
    PlayerModule,
    ClubModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".development.env" }),
    DatabaseModule,
    InfrastructureModule,
    GridModule,
  ],
  controllers: [],
  providers: [ConsoleLogger, SeedPlayersCommand, EuroleagueApiSeedCommand],
})
export class AppModule {}
