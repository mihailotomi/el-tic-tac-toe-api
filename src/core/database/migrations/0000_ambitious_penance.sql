CREATE TABLE IF NOT EXISTS "clubs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"code" char(3),
	CONSTRAINT "clubs_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "player_sesons" (
	"id" serial PRIMARY KEY NOT NULL,
	"club_id" integer,
	"player_id" integer,
	"season_name" varchar(6),
	"start_date" date,
	"end_date" date,
	CONSTRAINT "player_sesons_club_id_player_id_season_name_unique" UNIQUE("club_id","player_id","season_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "players" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"birth_date" date,
	"country" char(3),
	"external_id" integer,
	"image_url" text,
	CONSTRAINT "players_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "players_image_url_unique" UNIQUE("image_url")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "players_name_index" ON "players" ("name");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_sesons" ADD CONSTRAINT "player_sesons_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_sesons" ADD CONSTRAINT "player_sesons_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
