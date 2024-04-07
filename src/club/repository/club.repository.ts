import { Inject, Injectable } from "@nestjs/common";
import { DB_CONTEXT } from "src/core/database/dependency-injection/injection-token";
import { DbType } from "src/core/database/schema/db-type";
import { RawClubDto } from "../dto/raw-club.dto";
import { clubs } from "src/core/database/schema/schema";

@Injectable()
export class ClubRepository {
  constructor(@Inject(DB_CONTEXT) private dbContext: DbType) {}

  insertClubs = (payload: RawClubDto[]) => {
    return this.dbContext.insert(clubs).values(payload).onConflictDoNothing();
  };
}
