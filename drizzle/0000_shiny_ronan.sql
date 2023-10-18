DO $$ BEGIN
 CREATE TYPE "commentStatus" AS ENUM('COMMENT', 'REPLY');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "stripeSubscriptionStatus" AS ENUM('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"userId" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT account_provider_providerAccountId PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "articles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"cover_image" varchar(255) NOT NULL,
	"cover_image_key" varchar(255) NOT NULL,
	"userId" varchar(255) NOT NULL,
	"body" varchar(255) NOT NULL,
	"seoTitle" varchar(255) NOT NULL,
	"seoDescription" varchar,
	"seoOgImage" varchar,
	"seoOgImageKey" varchar,
	"subtitle" varchar,
	"disabledComments" boolean DEFAULT true NOT NULL,
	"likesCount" integer DEFAULT 0 NOT NULL,
	"slug" varchar(255) NOT NULL,
	"commentsCount" integer DEFAULT 0 NOT NULL,
	"readCount" integer DEFAULT 0 NOT NULL,
	"idDeleted" boolean DEFAULT false NOT NULL,
	"seriesId" varchar(255),
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comments" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"articleId" varchar(255) NOT NULL,
	"body" varchar(255) NOT NULL,
	"likesCount" integer DEFAULT 0 NOT NULL,
	"type" "commentStatus" NOT NULL,
	"parentId" varchar(255),
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customTabs" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"label" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"value" varchar(255) NOT NULL,
	"priority" integer NOT NULL,
	"handleId" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "handles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"handle" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"about" varchar(255),
	"user_id" integer,
	"json2" json DEFAULT '{"layout":"MAGAZINE"}'::json,
	CONSTRAINT "handles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"type" varchar(255) NOT NULL,
	"isRead" boolean NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"body" varchar DEFAULT '' NOT NULL,
	"slug" varchar DEFAULT '' NOT NULL,
	"title" varchar DEFAULT '' NOT NULL,
	"articleAuthor" varchar DEFAULT '' NOT NULL,
	"userId" varchar(255) NOT NULL,
	"fromId" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "series" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"cover_image" varchar(255) NOT NULL,
	"authorId" varchar(255) NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stripeEvents" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"type" varchar(255) NOT NULL,
	"data" json NOT NULL,
	"request" json NOT NULL,
	"pending_webhooks" integer NOT NULL,
	"livemode" boolean NOT NULL,
	"api_version" varchar(255) NOT NULL,
	"object" varchar(255) NOT NULL,
	"account" varchar(255) NOT NULL,
	"created" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" varchar(255),
	"followersCount" integer NOT NULL,
	"articlesCount" integer NOT NULL,
	"logo" varchar(255),
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP(3),
	"profile" varchar(255),
	"tagline" varchar(50),
	"cover_image" varchar(255),
	"bio" varchar(255),
	"skills" varchar(10)[],
	"location" varchar(20),
	"available" varchar(50),
	"json2" json DEFAULT '{"github":"","twitter":"","website":"","youtube":"","facebook":"","linkedin":"","instagram":"","stackoverflow":""}'::json,
	"followersCount" integer,
	"followingCount" integer,
	"stripeCustomerId" varchar(255),
	"stripeSubscriptionId" varchar(255),
	"stripeSubscriptionStatus" "stripeSubscriptionStatus",
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT verificationToken_identifier_token PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "userId_idx" ON "account" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "userId_idx" ON "articles" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "slug_idx" ON "articles" ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "userId_idx" ON "comments" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "articleId_idx" ON "comments" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "handleId_idx" ON "customTabs" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "userId_idx" ON "notifications" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "userId_idx" ON "series" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "seriesSlug_idx" ON "series" ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "userId_idx" ON "session" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "userId_idx" ON "stripeEvents" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "tags" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "slug_idx" ON "tags" ("slug");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "handles" ADD CONSTRAINT "handles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
