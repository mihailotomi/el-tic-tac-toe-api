import { Inject, Injectable } from "@nestjs/common";
import { DB_CONTEXT } from "src/core/database/constants/injection-token";
import { DbType, TransactionType } from "src/core/database/schema/db-type";
import { clubs, playerSeasons, players } from "src/core/database/schema/schema";
import { SubqueryWithSelection, alias } from "drizzle-orm/pg-core";
import { SQL, and, count, desc, eq, getTableColumns, ne, sql } from "drizzle-orm";
import { CreateClubDto } from "../dto/create-club.dto";
import { Club } from "../entities/club";
import { FindClubDto, isFindClubById } from "../dto/find-club.dto";

@Injectable()
export class ClubRepository {
  constructor(@Inject(DB_CONTEXT) private dbContext: DbType) {}

  /**
   * Find a club from the database, either by id or code
   * @param {FindClubDto} dto
   * @param {TransactionType} [tx] - transaction that can wrap the operation
   */
  findClub = async (dto: FindClubDto, tx?: TransactionType): Promise<Club | null> => {
    const db = tx ? tx : this.dbContext;

    const clubList = await db.select().from(clubs).where(this.buildWhereClause(dto));
    return clubList.length ? clubList[0] : null;
  };

  getGridClubsWithConstraint = async (
    constraintSqsList: SubqueryWithSelection<any & { id: number }, any>[],
  ): Promise<Club[]> => {
    return this.dbContext
      .select(this.getColumns())
      .from(constraintSqsList[0])
      .innerJoin(constraintSqsList[1], eq(constraintSqsList[1].id, constraintSqsList[0].id))
      .innerJoin(constraintSqsList[2], eq(constraintSqsList[2].id, constraintSqsList[0].id))
      .innerJoin(clubs, eq(clubs.id, constraintSqsList[0].id))
      .orderBy(sql`num_0 DESC`)
      .limit(3);
  };

  getConstraintSubqueryForClub = (
    constraintClub: Club,
    index: number,
  ): SubqueryWithSelection<any & { id: number }, any> => {
    const ps1 = alias(playerSeasons, "ps1");
    const ps2 = alias(playerSeasons, "ps2");

    return this.dbContext
      .select({
        id: ps1.clubId,
        num: count().as(`num_${index}`),
      })
      .from(ps1)
      .innerJoin(
        ps2,
        and(eq(ps1.playerId, ps2.playerId), eq(ps2.clubId, constraintClub.id), ne(ps1.clubId, constraintClub.id)),
      )
      .groupBy(ps1.clubId)
      .as(`temp_${index}`);
  };

  getConstraintSubqueryForCountry = (
    constraintCountry: string,
    index: number,
  ): SubqueryWithSelection<any & { id: number }, any> => {
    return this.dbContext
      .select({
        id: playerSeasons.clubId,
        num: count().as(`num_${index}`),
      })
      .from(playerSeasons)
      .innerJoin(players, and(eq(playerSeasons.playerId, players.id), eq(players.country, constraintCountry)))
      .groupBy(playerSeasons.clubId)
      .as(`temp_${index}`);
  };

  getRandomGridClubs = async ({
    difficultyLimit = 15,
    amount = 3,
  }: {
    difficultyLimit?: number;
    amount?: number;
  }): Promise<Club[]> => {
    const ps1 = alias(playerSeasons, "ps1");
    const ps2 = alias(playerSeasons, "ps2");

    const topClubsSq = this.dbContext
      .select(this.getColumns())
      .from(ps1)
      .innerJoin(ps2, and(eq(ps1.playerId, ps2.playerId), ne(ps1.clubId, ps2.clubId)))
      .innerJoin(clubs, eq(clubs.id, ps1.clubId))
      .groupBy(clubs.id, clubs.name, clubs.code, clubs.crestUrl, clubs.createdAt, clubs.updatedAt)
      .orderBy(desc(count()))
      .limit(difficultyLimit)
      .as("sq");

    return this.dbContext
      .select()
      .from(topClubsSq)
      .orderBy(sql`random()`)
      .limit(amount);
  };

  insertClubs = (payload: CreateClubDto[]) => {
    return this.dbContext.insert(clubs).values(payload).onConflictDoNothing();
  };

  /**
   * Builds a unique player where clause for queries and data manipulation
   * @private
   * @param {FindPlayerDto} dto
   */
  private buildWhereClause = (dto: FindClubDto): SQL => {
    return isFindClubById(dto) ? eq(clubs.id, dto.id) : eq(clubs.code, dto.code);
  };

  private getColumns = () => {
    const { createdAt, updatedAt, ...clubColumns } = getTableColumns(clubs);
    return clubColumns;
  };
}
