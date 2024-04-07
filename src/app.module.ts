import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { PlayerModule } from "./player/player.module";
import { ClubModule } from "./club/club.module";
import { DatabaseModule } from "./core/database/database.module";

@Module({
  imports: [
    PlayerModule,
    ClubModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".development.env" }),
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
