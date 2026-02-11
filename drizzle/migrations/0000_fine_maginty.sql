CREATE TABLE "achievements" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"achievement_type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"unlocked_at" text,
	"icon_url" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "biorhythm_snapshots" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"date" text NOT NULL,
	"physical" real,
	"emotional" real,
	"intellectual" real,
	"spiritual" real,
	"physical_peak" boolean DEFAULT false,
	"emotional_peak" boolean DEFAULT false,
	"intellectual_peak" boolean DEFAULT false,
	"spiritual_peak" boolean DEFAULT false,
	"sunrise_time" text,
	"sunset_time" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chapters" (
	"id" integer PRIMARY KEY NOT NULL,
	"order" integer NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"cycle" text,
	"unlock_trigger" text,
	"duration_minutes" integer,
	"canticle_url" text,
	"audio_url" text,
	"icon_url" text,
	"color_theme" text,
	"description" text,
	"content" text,
	"unlock_conditions" text,
	"lore_metadata" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"message" text,
	"data" text,
	"read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"action" text NOT NULL,
	"attempts" integer DEFAULT 1,
	"first_attempt_at" text DEFAULT CURRENT_TIMESTAMP,
	"last_attempt_at" text DEFAULT CURRENT_TIMESTAMP,
	"blocked_until" text,
	"ip_address" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"revoked_at" text,
	"ip_address" text,
	"user_agent" text
);
--> statement-breakpoint
CREATE TABLE "streaks" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"streak_type" text NOT NULL,
	"current_count" integer DEFAULT 0,
	"longest_count" integer DEFAULT 0,
	"last_activity_date" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sun_cache" (
	"id" text PRIMARY KEY NOT NULL,
	"latitude" real NOT NULL,
	"longitude" real NOT NULL,
	"date" text NOT NULL,
	"sunrise" text,
	"sunset" text,
	"solar_noon" text,
	"day_length" text,
	"cached_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_progress" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"chapter_id" integer NOT NULL,
	"unlocked_at" text,
	"completed_at" text,
	"time_spent_seconds" integer DEFAULT 0,
	"completion_percentage" integer DEFAULT 0,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"google_id" text,
	"birthdate" text,
	"timezone" text DEFAULT 'UTC',
	"role" text DEFAULT 'user',
	"email_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_google_id_unique" UNIQUE("google_id")
);
--> statement-breakpoint
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "biorhythm_snapshots" ADD CONSTRAINT "biorhythm_snapshots_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "streaks" ADD CONSTRAINT "streaks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;