ALTER TABLE "player_seasons" ALTER COLUMN "season_name" SET DATA TYPE integer USING (season_name::integer);
ALTER TABLE "player_seasons" RENAME COLUMN "season_name" TO "season";