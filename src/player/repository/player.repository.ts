import { SQL, and, countDistinct, eq, inArray, sql } from "drizzle-orm";
import { Inject, Injectable } from "@nestjs/common";
import { DB_CONTEXT } from "src/core/database/constants/injection-token";
import { DbType } from "src/core/database/schema/db-type";
import { clubs, playerSeasons, players } from "src/core/database/schema/schema";
import { CreatePlayerSeasonDto } from "../dto/create-player-season.dto";
import { CheckPlayerMatchDto } from "../dto/check-player-match.dto";
import { Player } from "../models/player";

@Injectable()
export class PlayerRepository {
  constructor(@Inject(DB_CONTEXT) private dbContext: DbType) {}

  /**
   * Text search for players
   * @param {{ search: string; limit: number }} params
   * @returns {Promise<Player[]>}
   */
  nameSearchAutocomplete = async ({ search, limit }: { search: string; limit: number }): Promise<Player[]> => {
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

  /**
   * Check if a certain player played for a certain club
   * @param {CheckPlayerMatchDto} dto dto with club and player identifiers
   * @returns {Promise<boolean>} validation result
   */
  validatePlayerClubHistory = async ({ clubIds, playerId }: CheckPlayerMatchDto): Promise<boolean> => {
    const [result] = await this.dbContext
      .select({ played: eq(countDistinct(playerSeasons.clubId), clubIds.length) as SQL<boolean> })
      .from(playerSeasons)
      .where(and(eq(playerSeasons.playerId, playerId), inArray(playerSeasons.clubId, clubIds)));

    return result.played;
  };

  // TODO: split to insert and upsert
  insertSeasonPlayers = async (playerSeasonPayload: CreatePlayerSeasonDto[]) => {
    // Upsert players (add country and image if we don't already have it)
    return this.dbContext.transaction(async (tx) => {
      await Promise.all(
        playerSeasonPayload
          .filter(({ player }) => player?.country && player?.birthDate && player?.firstName && player?.lastName)
          .map((ps) => {
            return tx
              .insert(players)
              .values(ps.player)
              .onConflictDoUpdate({
                target: [players.firstName, players.lastName, players.birthDate],
                set: {
                  country: sql`COALESCE(players.country, EXCLUDED.country)`,
                  imageUrl: sql`COALESCE(players.image_url, EXCLUDED.image_url)`,
                  updatedAt: new Date(),
                },
                where: sql`players.country IS NULL OR players.image_url IS NULL`,
              });
          }),
      );

      await Promise.all(
        playerSeasonPayload.map(async (playerSeason) => {
          const playerData = await tx
            .select({ id: players.id })
            .from(players)
            .where(
              and(
                eq(players.firstName, playerSeason.player?.firstName),
                eq(players.lastName, playerSeason.player?.lastName),
                eq(players.birthDate, playerSeason.player?.birthDate),
              ),
            );

          const clubData = await tx
            .select({ id: clubs.id })
            .from(clubs)
            .where(eq(clubs.code, playerSeason.playerSeason?.clubCode));

          const { startDate, endDate, season } = playerSeason.playerSeason;

          if (playerData?.length && clubData?.length) {
            await tx
              .insert(playerSeasons)
              .values({
                startDate,
                endDate,
                season,
                playerId: playerData[0].id,
                clubId: clubData[0].id,
              })
              .onConflictDoNothing();
          }
        }),
      );
    });
  };
}
