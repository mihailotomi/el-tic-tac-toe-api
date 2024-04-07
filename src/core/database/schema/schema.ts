import { sql } from "drizzle-orm";
import { integer, serial, text, pgTable, char, varchar, unique, index, timestamp } from "drizzle-orm/pg-core";

export const players = pgTable(
  "players",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    birthDate: timestamp("birth_date").notNull(),
    country: char("country", { length: 3 }).notNull(),
    externalId: integer("external_id").notNull(),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    unqExternalId: unique().on(t.externalId),
    unqImage: unique().on(t.imageUrl).nullsNotDistinct(),
    nameIdx: index().on(t.name),
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
    seasonName: varchar("season_name", { length: 6 }).notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    unqPlayerSeason: unique().on(t.clubId, t.playerId, t.seasonName),
  }),
);
