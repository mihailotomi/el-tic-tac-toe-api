import { ConsoleLogger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { PlayerModule } from "./player/player.module";
import { ClubModule } from "./club/club.module";
import { DatabaseModule } from "./core/database/database.module";

import { InfrastructureModule } from "./core/infrastructure/infrastructure.module";
import { GridModule } from "./grid/grid.module";
import { SeedPlayersCommand } from "./cli/commands/seed-players.command";
import { EuroleagueApiSeedCommand } from "./cli/commands/euroleague-api-seed.command";
import { ProballersSeedCommand } from "./cli/commands/proballers-seed.command";
import { GatewayModule } from "./core/gateway/gateway.module";
import { SeedClubsCommand } from "./cli/commands/seed-clubs.command";

@Module({
  imports: [
    PlayerModule,
    ClubModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env.local" }),
    DatabaseModule,
    InfrastructureModule,
    GridModule,
    GatewayModule,
  ],
  controllers: [],
  providers: [ConsoleLogger, SeedPlayersCommand, EuroleagueApiSeedCommand, ProballersSeedCommand, SeedClubsCommand],
})
export class AppModule {}
