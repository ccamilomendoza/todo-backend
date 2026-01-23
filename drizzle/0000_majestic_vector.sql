CREATE TABLE "todo" (
	"create_at" timestamp DEFAULT now() NOT NULL,
	"description" varchar(255) NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"status" varchar NOT NULL,
	"title" varchar(255) NOT NULL
);
