CREATE TYPE "public"."biolink_status" AS ENUM('draft', 'public');--> statement-breakpoint
CREATE TYPE "public"."component_type" AS ENUM('button', 'text', 'image', 'link', 'social-links', 'projects', 'contact-form', 'divider');--> statement-breakpoint
CREATE TABLE "biolink_components" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" integer NOT NULL,
	"type" "component_type" NOT NULL,
	"title" varchar(255),
	"content" text,
	"url" varchar(500),
	"image_url" text,
	"background_color" varchar(7),
	"text_color" varchar(7),
	"border_color" varchar(7),
	"order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"settings" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "biolink_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"title" varchar(255),
	"bio" text,
	"avatar" text,
	"career" varchar(255),
	"location" varchar(255),
	"status" "biolink_status" DEFAULT 'draft' NOT NULL,
	"background_color" varchar(7) DEFAULT '#ffffff',
	"text_color" varchar(7) DEFAULT '#000000',
	"accent_color" varchar(7) DEFAULT '#3b82f6',
	"custom_css" text,
	"meta_title" varchar(255),
	"meta_description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "biolink_profiles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "biolink_projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"image_url" text,
	"project_url" varchar(500),
	"github_url" varchar(500),
	"technologies" text,
	"is_visible" boolean DEFAULT true NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "biolink_social_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" integer NOT NULL,
	"platform" varchar(50) NOT NULL,
	"url" varchar(500) NOT NULL,
	"username" varchar(100),
	"is_visible" boolean DEFAULT true NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "biolink_versions" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" integer NOT NULL,
	"version_number" integer NOT NULL,
	"data" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "biolink_components" ADD CONSTRAINT "biolink_components_profile_id_biolink_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."biolink_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "biolink_profiles" ADD CONSTRAINT "biolink_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "biolink_projects" ADD CONSTRAINT "biolink_projects_profile_id_biolink_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."biolink_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "biolink_social_links" ADD CONSTRAINT "biolink_social_links_profile_id_biolink_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."biolink_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "biolink_versions" ADD CONSTRAINT "biolink_versions_profile_id_biolink_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."biolink_profiles"("id") ON DELETE cascade ON UPDATE no action;