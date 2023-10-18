CREATE TABLE IF NOT EXISTS "readers_to_articles" (
	"userId" varchar(255) NOT NULL,
	"articleId" varchar(255) NOT NULL,
	CONSTRAINT readers_to_articles_userId_articleId PRIMARY KEY("userId","articleId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "readers_to_articles" ADD CONSTRAINT "readers_to_articles_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "readers_to_articles" ADD CONSTRAINT "readers_to_articles_articleId_articles_id_fk" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
