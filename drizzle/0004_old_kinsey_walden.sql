CREATE TABLE IF NOT EXISTS "likes_to_articles" (
	"userId" varchar(255) NOT NULL,
	"articleId" varchar(255) NOT NULL,
	CONSTRAINT likes_to_articles_userId_articleId PRIMARY KEY("userId","articleId")
);
