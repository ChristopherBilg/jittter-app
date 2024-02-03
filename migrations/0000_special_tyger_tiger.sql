CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY NOT NULL,
	"first_name" text,
	"last_name" text,
	"created_at" date DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" date DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" date
);
