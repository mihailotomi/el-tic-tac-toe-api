import { integer, serial, text, pgTable, date, char, varchar, unique, index } from "drizzle-orm/pg-core";

export const players = pgTable(
  "players",
  {
    id: serial("id").primaryKey(),
    name: text("name"),
    birthDate: date("birth_date"),
    country: char("country", { length: 3 }),
    externalId: integer("external_id"),
    imageUrl: text("image_url"),
  },
  (t) => ({
    unqExternalId: unique().on(t.externalId),
    unqImage: unique().on(t.imageUrl),
    nameIdx: index().on(t.name),
  }),
);

export const clubs = pgTable(
  "clubs",
  {
    id: serial("id").primaryKey(),
    name: text("name"),
    code: char("code", { length: 3 }),
  },
  (t) => ({
    unqCode: unique().on(t.code),
  }),
);

export const playerSeasons = pgTable(
  "player_sesons",
  {
    id: serial("id").primaryKey(),
    clubId: integer("club_id").references(() => clubs.id),
    playerId: integer("player_id").references(() => players.id),
    seasonName: varchar("season_name", { length: 6 }),
    startDate: date("start_date"),
    endDate: date("end_date"),
  },
  (t) => ({
    unqPlayerSeason: unique().on(t.clubId, t.playerId, t.seasonName),
  }),
);
