CREATE TABLE IF NOT EXISTS "tags_to_users" (
	"tagId" varchar(255) NOT NULL,
	"userId" varchar(255) NOT NULL,
	CONSTRAINT tags_to_users_tagId_userId PRIMARY KEY("tagId","userId")
);
