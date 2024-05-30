CREATE TABLE IF NOT EXISTS "clubs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"code" char(3) NOT NULL,
	"crest_url" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "clubs_code_unique" UNIQUE("code"),
	CONSTRAINT "clubs_crest_url_unique" UNIQUE NULLS NOT DISTINCT("crest_url")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "player_seasons" (
	"id" serial PRIMARY KEY NOT NULL,
	"club_id" integer,
	"player_id" integer,
	"season" integer NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "player_seasons_club_id_player_id_season_unique" UNIQUE("club_id","player_id","season")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "players" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"birth_date" date NOT NULL,
	"country" char(3),
	"image_url" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "players_first_name_last_name_birth_date_unique" UNIQUE("first_name","last_name","birth_date")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "players_first_name_last_name_index" ON "players" ("first_name","last_name");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_seasons" ADD CONSTRAINT "player_seasons_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_seasons" ADD CONSTRAINT "player_seasons_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
