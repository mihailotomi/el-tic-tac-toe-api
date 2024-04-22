ALTER TABLE "players" RENAME COLUMN "name" TO "first_name";--> statement-breakpoint
ALTER TABLE "players" DROP CONSTRAINT "players_name_birth_date_country_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "players_name_index";--> statement-breakpoint
ALTER TABLE "players" ALTER COLUMN "first_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "last_name" text;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "players_first_name_last_name_index" ON "players" ("first_name","last_name");--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_first_name_last_name_birth_date_country_unique" UNIQUE("first_name","last_name","birth_date","country");