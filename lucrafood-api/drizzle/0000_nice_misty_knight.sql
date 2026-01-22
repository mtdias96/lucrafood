CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
