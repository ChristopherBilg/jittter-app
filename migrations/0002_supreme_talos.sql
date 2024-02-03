ALTER TABLE "user" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "id" SET DEFAULT nextval('user_id_seq'::regclass);