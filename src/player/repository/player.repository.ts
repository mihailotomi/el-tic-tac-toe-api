import { SQL, and, countDistinct, eq, inArray, sql } from "drizzle-orm";
import { Inject, Injectable } from "@nestjs/common";
import { DB_CONTEXT } from "src/core/database/constants/injection-token";
import { DbType } from "src/core/database/schema/db-type";
import { clubs, playerSeasons, players } from "src/core/database/schema/schema";
import { CreatePlayerSeasonDto } from "../dto/create-player-season.dto";
import { RawPlayerDto } from "../dto/raw-player.dto";
import { CheckPlayerMatchDto } from "../dto/check-player-match.dto";

@Injectable()
export class PlayerRepository {
  constructor(@Inject(DB_CONTEXT) private dbContext: DbType) {}

  nameSearchAutocomplete = async ({ search, limit }: { search: string; limit: number }): Promise<RawPlayerDto[]> => {
    return this.dbContext
      .select()
      .from(players)
      .where(
        sql.raw(`
        (CONCAT(first_name, ' ', last_name) ILIKE '%${search}%') 
        OR (CONCAT(last_name, ' ',first_name) ILIKE '%${search}%')`),
      )
      .orderBy(players.lastName)
      .limit(limit);
  };

  validatePlayerClubHistory = async ({ clubIds, playerId }: CheckPlayerMatchDto): Promise<boolean> => {
    const [result] = await this.dbContext
      .select({ played: eq(countDistinct(playerSeasons.clubId), clubIds.length) as SQL<boolean> })
      .from(playerSeasons)
      .where(and(eq(playerSeasons.playerId, playerId), inArray(playerSeasons.clubId, clubIds)));

    return result.played;
  };

  insertSeasonPlayers = async (playerSeasonPayload: CreatePlayerSeasonDto[]) => {
    return this.dbContext.transaction(async (tx) => {
      await tx
        .insert(players)
        .values(
          playerSeasonPayload
            .map((ps) => ps.player)
            .map((p) => {
              const [lastName, firstName] = p.name.split(", ");
              const { name: _name, ...newPlayer } = p;

              return {
                ...newPlayer,
                firstName,
                lastName,
              };
            })
            .filter((p) => p?.country && p?.birthDate && p?.firstName && p?.lastName),
        )
        .onConflictDoNothing();

      await Promise.all(
        playerSeasonPayload.map(async (playerSeason) => {
          const playerData = await tx
            .select({ id: players.id })
            .from(players)
            .where(
              and(
                eq(sql`CONCAT(${players.lastName}, ', ', ${players.firstName})`, playerSeason.player?.name),
                eq(players.birthDate, playerSeason.player?.birthDate),
              ),
            );

          const clubData = await tx
            .select({ id: clubs.id })
            .from(clubs)
            .where(eq(clubs.code, playerSeason.playerSeason?.clubCode));

          const { startDate, endDate, seasonName } = playerSeason.playerSeason;

          if (playerData?.length && clubData?.length) {
            await tx
              .insert(playerSeasons)
              .values({ startDate, endDate, seasonName, playerId: playerData[0].id, clubId: clubData[0].id })
              .onConflictDoNothing();
          }
        }),
      );
    });
  };
}
