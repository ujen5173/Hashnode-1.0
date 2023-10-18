CREATE TABLE IF NOT EXISTS "follower" (
	"user_id" text NOT NULL,
	"follower_id" text NOT NULL,
	CONSTRAINT follower_user_id_follower_id PRIMARY KEY("user_id","follower_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "follower" ADD CONSTRAINT "follower_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "follower" ADD CONSTRAINT "follower_follower_id_user_id_fk" FOREIGN KEY ("follower_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
