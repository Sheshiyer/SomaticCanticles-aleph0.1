CREATE TABLE "highlights" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"chapter_id" integer NOT NULL,
	"scene_index" integer NOT NULL,
	"text" text NOT NULL,
	"color" text DEFAULT 'primary' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "streaks" ADD COLUMN "freezes_used" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "highlights" ADD CONSTRAINT "highlights_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highlights" ADD CONSTRAINT "highlights_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;