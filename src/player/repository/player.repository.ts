import { SQL, and, countDistinct, eq, getTableColumns, inArray, sql } from "drizzle-orm";
import { Inject, Injectable } from "@nestjs/common";
import { DB_CONTEXT } from "src/core/database/constants/injection-token";
import { DbType, TransactionType } from "src/core/database/schema/db-type";
import { clubs, playerSeasons, players } from "src/core/database/schema/schema";
import { CreatePlayerSeasonDto } from "../dto/create-player-season.dto";
import { CheckPlayerMatchDto } from "../dto/check-player-match.dto";
import { Player } from "../models/player";
import { CreatePlayerDto } from "../dto/create-player.dto";
import { PlayerSeason } from "../models/playerSeason";
import { PgUpdateBuilder } from "drizzle-orm/pg-core";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { FindPlayerDto, isFindPlayerById } from "../dto/find-player.dto";
import { BaseRepository } from "src/core/database/repository/base.repository";

@Injectable()
export class PlayerRepository extends BaseRepository {
  constructor(@Inject(DB_CONTEXT) protected dbContext: DbType) {
    super(dbContext);
  }

  /**
   * Text search for players
   * @param {{ search: string; limit: number }} params
   * @param {TransactionType} [tx] - transaction that can wrap the operation
   * @returns {Promise<Player[]>}
   */
  nameSearchAutocomplete = async (
    { search, limit }: { search: string; limit: number },
    tx?: TransactionType,
  ): Promise<Player[]> => {
    const db = tx ? tx : this.dbContext;

    return db
      .select(this.getColumns())
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
   * @param {TransactionType} [tx] - transaction that can wrap the operation
   * @returns {Promise<boolean>} validation result
   */
  validatePlayerClubHistory = async (
    { clubIds, playerId }: CheckPlayerMatchDto,
    tx?: TransactionType,
  ): Promise<boolean> => {
    const db = tx ? tx : this.dbContext;

    const [result] = await db
      .select({ played: eq(countDistinct(playerSeasons.clubId), clubIds.length) as SQL<boolean> })
      .from(playerSeasons)
      .where(and(eq(playerSeasons.playerId, playerId), inArray(playerSeasons.clubId, clubIds)));

    return result.played;
  };

  /** Returns all seasons a player has played
   * @param {number} playerId
   * @param {TransactionType} [tx] - transaction that can wrap the operation
   * @returns {Promise<PlayerSeason[]>}
   */
  getPlayerSeasons = async (playerId: number, tx?: TransactionType): Promise<PlayerSeason[]> => {
    const db = tx ? tx : this.dbContext;

    const { createdAt: _cca, updatedAt: _cua, ...clubColumns } = getTableColumns(clubs);
    const { createdAt: _pca, updatedAt: _pua, ...playerColumns } = getTableColumns(players);
    const {
      createdAt: _psca,
      updatedAt: _psua,
      startDate: _pssd,
      endDate: _psed,
      ...playerSeasonColumns
    } = getTableColumns(playerSeasons);

    const result = await db
      .select({
        club: clubColumns,
        player: playerColumns,
        ...playerSeasonColumns,
        startDate: playerSeasons.startDate,
        endDate: playerSeasons.endDate,
      })
      .from(playerSeasons)
      .where(eq(playerSeasons.playerId, playerId))
      .innerJoin(clubs, eq(clubs.id, playerSeasons.clubId))
      .innerJoin(players, eq(players.id, playerSeasons.playerId))
      .groupBy();
    return result;
  };

  /**
   * Insert a batch of player if they don't exist in db
   * @param {CreatePlayerDto[]} playerDtoList list of dtos
   * @param {TransactionType} [tx] - transaction that can wrap the operation
   */
  insertPlayers = async (playerDtoList: CreatePlayerDto[], tx?: TransactionType): Promise<void> => {
    const db = tx ? tx : this.dbContext;

    await db.insert(players).values(playerDtoList).onConflictDoNothing();
  };

  /**
   * Insert or update country and image if they are null
   * @param {TransactionType} [tx] - transaction that can wrap the operation
   * @param {CreatePlayerDto[]} playerDtoList list of dtos
   */
  upsertPlayers = async (playerDtoList: CreatePlayerDto[], tx?: TransactionType): Promise<void> => {
    const db = tx ? tx : this.dbContext;

    await Promise.all(
      playerDtoList.map((player) => {
        return db
          .insert(players)
          .values(player)
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
  };

  /**
   * Update player seasons - starts the update builder and returns it to the caller
   * @param {TransactionType} [tx] - transaction that can wrap the operation
   * @returns {PgUpdateBuilder}
   */
  updatePlayerSeasons = (tx?: TransactionType): PgUpdateBuilder<typeof playerSeasons, NodePgQueryResultHKT> => {
    const db = tx ? tx : this.dbContext;

    return db.update(playerSeasons);
  };

  /**
   * Find a player from the database, either by id or by combination of fields that represent the unique constraint
   * @param {FindPlayerDto} dto
   * @param {TransactionType} [tx] - transaction that can wrap the operation
   */
  findPlayer = async (dto: FindPlayerDto, tx?: TransactionType): Promise<Player | null> => {
    const db = tx ? tx : this.dbContext;

    const playerList = await db.select(this.getColumns()).from(players).where(this.buildWhereClause(dto));
    return playerList.length ? playerList[0] : null;
  };

  /**
   * Delete a player by unique properties
   * @param {FindPlayerDto} dto
   * @param {TransactionType} [tx]
   */
  deletePlayer = async (dto: FindPlayerDto, tx?: TransactionType): Promise<Player> => {
    const db = tx ? tx : this.dbContext;

    const [result] = await db.delete(players).where(this.buildWhereClause(dto)).returning();
    return result;
  };

  /**
   * Insert one player season
   * @param {CreatePlayerSeasonDto} playerSeason
   * @param {number} playerId
   * @param {number} clubId
   * @param {TransactionType} [tx]
   */
  insertPlayerSeason = async (
    playerSeason: CreatePlayerSeasonDto,
    playerId: number,
    clubId: number,
    tx?: TransactionType,
  ) => {
    const db = tx ? tx : this.dbContext;

    const { startDate, endDate, season } = playerSeason.playerSeason;

    await db
      .insert(playerSeasons)
      .values({
        startDate,
        endDate,
        season,
        playerId: playerId,
        clubId: clubId,
      })
      .onConflictDoNothing();
  };

  /**
   * Builds a unique player where clause for queries and data manipulation
   * @private
   * @param {FindPlayerDto} dto
   */
  private buildWhereClause = (dto: FindPlayerDto): SQL => {
    return isFindPlayerById(dto)
      ? eq(players.id, dto.id)
      : and(
          eq(players.firstName, dto.firstName),
          eq(players.lastName, dto.lastName),
          eq(players.birthDate, dto.birthDate),
        );
  };

  private getColumns = () => {
    const { createdAt: _pca, updatedAt: _pua, ...playerColumns } = getTableColumns(players);
    return playerColumns;
  };
}
