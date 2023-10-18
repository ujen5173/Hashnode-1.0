CREATE TABLE IF NOT EXISTS "followers" (
	"user_id" text NOT NULL,
	"followers_id" text NOT NULL,
	CONSTRAINT followers_user_id_followers_id PRIMARY KEY("user_id","followers_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "following" (
	"user_id" text NOT NULL,
	"following_id" text NOT NULL,
	CONSTRAINT following_user_id_following_id PRIMARY KEY("user_id","following_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "followers" ADD CONSTRAINT "followers_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "followers" ADD CONSTRAINT "followers_followers_id_user_id_fk" FOREIGN KEY ("followers_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "following" ADD CONSTRAINT "following_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "following" ADD CONSTRAINT "following_following_id_user_id_fk" FOREIGN KEY ("following_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
