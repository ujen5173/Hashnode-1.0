CREATE TABLE IF NOT EXISTS "tags_to_articles" (
	"tagId" varchar(255) NOT NULL,
	"articleId" varchar(255) NOT NULL,
	CONSTRAINT tags_to_articles_tagId_articleId PRIMARY KEY("tagId","articleId")
);
