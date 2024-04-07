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
	"season_name" varchar(6) NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "player_seasons_club_id_player_id_season_name_unique" UNIQUE("club_id","player_id","season_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "players" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"birth_date" timestamp NOT NULL,
	"country" char(3) NOT NULL,
	"external_id" integer NOT NULL,
	"image_url" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "players_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "players_image_url_unique" UNIQUE NULLS NOT DISTINCT("image_url")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "players_name_index" ON "players" ("name");--> statement-breakpoint
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
