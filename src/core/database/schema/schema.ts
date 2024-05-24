import { sql } from "drizzle-orm";
import { integer, serial, text, pgTable, char, unique, index, timestamp } from "drizzle-orm/pg-core";

export const players = pgTable(
  "players",
  {
    id: serial("id").primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    birthDate: timestamp("birth_date").notNull(),
    country: char("country", { length: 3 }),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    unqNameBirthCountry: unique().on(t.firstName, t.lastName, t.birthDate),
    nameIdx: index().on(t.firstName, t.lastName),
  }),
);

export const clubs = pgTable(
  "clubs",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    code: char("code", { length: 3 }).notNull(),
    crestUrl: text("crest_url"),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    unqCode: unique().on(t.code),
    unqCrest: unique().on(t.crestUrl).nullsNotDistinct(),
  }),
);

export const playerSeasons = pgTable(
  "player_seasons",
  {
    id: serial("id").primaryKey(),
    clubId: integer("club_id").references(() => clubs.id),
    playerId: integer("player_id").references(() => players.id),
    season: integer("season_name").notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    unqPlayerSeason: unique().on(t.clubId, t.playerId, t.season),
  }),
);
