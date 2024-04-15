import { Inject, Injectable } from "@nestjs/common";
import { DB_CONTEXT } from "src/core/database/dependency-injection/injection-token";
import { DbType } from "src/core/database/schema/db-type";
import { clubs } from "src/core/database/schema/schema";
import { CreateClubDto } from "../dto/create-club.dto";

@Injectable()
export class ClubRepository {
  constructor(@Inject(DB_CONTEXT) private dbContext: DbType) {}

  insertClubs = (payload: CreateClubDto[]) => {
    return this.dbContext.insert(clubs).values(payload).onConflictDoNothing();
  };
}
