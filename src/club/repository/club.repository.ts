import { Inject, Injectable } from "@nestjs/common";
import { DB_CONTEXT } from "src/core/database/constants/injection-token";
import { DbType, TransactionType } from "src/core/database/schema/db-type";
import { clubs, playerSeasons } from "src/core/database/schema/schema";
import { alias } from "drizzle-orm/pg-core";
import { and, count, desc, eq, ne, sql } from "drizzle-orm";
import { CreateClubDto } from "../dto/create-club.dto";
import { Club } from "../models/club";
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
    const where = isFindClubById(dto) ? eq(clubs.id, dto.id) : eq(clubs.code, dto.code);

    const clubList = await db.select().from(clubs).where(where);
    return clubList.length ? clubList[0] : null;
  };

  getGridClubsWithConstraint = async ({
    constraintClubs,
  }: {
    difficultyLimit?: number;
    amount?: number;
    constraintClubs: Club[];
  }): Promise<Club[]> => {
    const constraintClubSqs = constraintClubs.map((c, i) => {
      const ps1 = alias(playerSeasons, "ps1");
      const ps2 = alias(playerSeasons, "ps2");

      return this.dbContext
        .select({
          id: ps1.clubId,
          num: count().as(`num${i}`),
        })
        .from(ps1)
        .innerJoin(ps2, and(eq(ps1.playerId, ps2.playerId), eq(ps2.clubId, c.id), ne(ps1.clubId, c.id)))
        .groupBy(ps1.clubId)
        .as(`temp${i}`);
    });

    return this.dbContext
      .select({
        id: clubs.id,
        name: clubs.name,
        code: clubs.code,
        crestUrl: clubs.crestUrl,
        createdAt: clubs.createdAt,
        updatedAt: clubs.updatedAt,
      })
      .from(constraintClubSqs[0])
      .innerJoin(constraintClubSqs[1], eq(constraintClubSqs[1].id, constraintClubSqs[0].id))
      .innerJoin(constraintClubSqs[2], eq(constraintClubSqs[2].id, constraintClubSqs[0].id))
      .innerJoin(clubs, eq(clubs.id, constraintClubSqs[0].id))
      .orderBy(sql`num1 DESC`)
      .limit(3);
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
      .select({
        id: clubs.id,
        name: clubs.name,
        code: clubs.code,
        crestUrl: clubs.crestUrl,
        createdAt: clubs.createdAt,
        updatedAt: clubs.updatedAt,
      })
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
}
