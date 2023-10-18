ALTER TABLE "handles" RENAME COLUMN "json2" TO "social";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "json2" TO "social";--> statement-breakpoint
ALTER TABLE "handles" ALTER COLUMN "social" SET DEFAULT '{"github":"","twitter":"","website":"","youtube":"","facebook":"","linkedin":"","instagram":"","stackoverflow":""}'::json;--> statement-breakpoint
ALTER TABLE "handles" ADD COLUMN "appearance" json DEFAULT '{"layout":"MAGAZINE"}'::json;