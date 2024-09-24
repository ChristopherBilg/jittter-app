ALTER TABLE "user" ADD COLUMN "pass_key" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "password";