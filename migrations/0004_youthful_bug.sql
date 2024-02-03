CREATE TABLE IF NOT EXISTS "user" (
	"id" integer PRIMARY KEY DEFAULT nextval('user_id_seq'::regclass) NOT NULL,
	"first_name" text,
	"last_name" text,
	"created_at" date DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" date DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" date
);
