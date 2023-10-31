ALTER TABLE "handles" RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
ALTER TABLE "handles" DROP CONSTRAINT "handles_user_id_unique";--> statement-breakpoint
ALTER TABLE "handles" DROP CONSTRAINT "handles_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "handles" ALTER COLUMN "userId" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "handles" ALTER COLUMN "userId" SET NOT NULL;