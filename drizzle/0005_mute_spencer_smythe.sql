DO $$ BEGIN
 ALTER TABLE "likes_to_articles" ADD CONSTRAINT "likes_to_articles_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "likes_to_articles" ADD CONSTRAINT "likes_to_articles_articleId_articles_id_fk" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
