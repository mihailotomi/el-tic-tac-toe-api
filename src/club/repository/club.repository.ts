import { Inject, Injectable } from "@nestjs/common";
import { DB_CONTEXT } from "src/core/database/constants/injection-token";
import { DbType } from "src/core/database/schema/db-type";
import { clubs, playerSeasons } from "src/core/database/schema/schema";
import { alias } from "drizzle-orm/pg-core";
import { and, count, desc, eq, ne, sql } from "drizzle-orm";
import { CreateClubDto } from "../dto/create-club.dto";
import { Club } from "../models/club";

@Injectable()
export class ClubRepository {
  constructor(@Inject(DB_CONTEXT) private dbContext: DbType) {}

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
        num: count().as("num")
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
