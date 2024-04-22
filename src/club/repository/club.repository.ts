import { Inject, Injectable } from "@nestjs/common";
import { DB_CONTEXT } from "src/core/database/constants/injection-token";
import { DbType } from "src/core/database/schema/db-type";
import { clubs } from "src/core/database/schema/schema";
import { CreateClubDto } from "../dto/create-club.dto";
import { alias } from "drizzle-orm/pg-core";
import { count, eq, sql } from "drizzle-orm";

@Injectable()
export class ClubRepository {
  constructor(@Inject(DB_CONTEXT) private dbContext: DbType) {}

  getRandomGridClubs = async ({ difficultyLimit = 15, amount = 3 }: { difficultyLimit?: number; amount?: number }) => {
    const parent = alias(clubs, "parent");
    const topClubsSq = this.dbContext
      .select({ clubId: clubs.id, numPlayers: count() })
      .from(clubs)
      .innerJoin(parent, eq(parent.id, clubs.id))
      .groupBy(clubs.id)
      .orderBy(count())
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
