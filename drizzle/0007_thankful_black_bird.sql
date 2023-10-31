CREATE TABLE IF NOT EXISTS "likes_to_comments" (
	"user_id" varchar NOT NULL,
	"comment_id" varchar NOT NULL,
	CONSTRAINT likes_to_comments_user_id_comment_id PRIMARY KEY("user_id","comment_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "likes_to_comments" ADD CONSTRAINT "likes_to_comments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "likes_to_comments" ADD CONSTRAINT "likes_to_comments_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
