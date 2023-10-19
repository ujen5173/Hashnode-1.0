ALTER TABLE "user" ALTER COLUMN "followersCount" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "followingCount" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "username" varchar(255) NOT NULL;