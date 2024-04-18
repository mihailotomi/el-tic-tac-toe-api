import { Inject, Injectable } from "@nestjs/common";
import { DB_CONTEXT } from "src/core/database/constants/injection-token";
import { DbType } from "src/core/database/schema/db-type";
import { clubs, playerSeasons, players } from "src/core/database/schema/schema";
import { CreatePlayerSeasonDto } from "../dto/create-player-season.dto";
import { and, count, eq, sql } from "drizzle-orm";

@Injectable()
export class PlayerRepository {
  constructor(@Inject(DB_CONTEXT) private dbContext: DbType) {}

  insertSeasonPlayers = async (playerSeasonPayload: CreatePlayerSeasonDto[]) => {
    return await this.dbContext.transaction(async (tx) => {
      await tx
        .insert(players)
        .values(playerSeasonPayload.map((ps) => ps.player))
        .onConflictDoNothing();

      for (let playerSeason of playerSeasonPayload) {
        const playerData = await tx
          .select({ id: players.id })
          .from(players)
          .where(and(eq(players.name, playerSeason.player.name), eq(players.birthDate, playerSeason.player.birthDate)));

        const clubData = await tx
          .select({ id: clubs.id })
          .from(clubs)
          .where(eq(clubs.code, playerSeason.playerSeason.clubCode));

        const { startDate, endDate, seasonName } = playerSeason.playerSeason;

        if (playerData?.length && clubData?.length) {
          await tx
            .insert(playerSeasons)
            .values({ startDate, endDate, seasonName, playerId: playerData[0].id, clubId: clubData[0].id })
            .onConflictDoNothing();
        }
      }
    });
  };
}
