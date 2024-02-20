ALTER TABLE "reminder" RENAME TO "note";--> statement-breakpoint
ALTER TABLE "note" DROP CONSTRAINT "reminder_user_id_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "note" ADD CONSTRAINT "note_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
