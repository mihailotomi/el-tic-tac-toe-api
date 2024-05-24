ALTER TABLE "players" DROP CONSTRAINT "players_first_name_last_name_birth_date_country_unique";--> statement-breakpoint
ALTER TABLE "players" ALTER COLUMN "first_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ALTER COLUMN "last_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_first_name_last_name_birth_date_unique" UNIQUE("first_name","last_name","birth_date");