CREATE TABLE "board" (
	"create_at" timestamp DEFAULT now() NOT NULL,
	"description" varchar(255),
	"id" uuid PRIMARY KEY NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"name" varchar(255),
	"project_id" uuid NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "column" (
	"board_id" uuid NOT NULL,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"position" numeric NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project" (
	"color" varchar(7),
	"create_at" timestamp DEFAULT now() NOT NULL,
	"description" varchar(255),
	"end_date" timestamp,
	"id" uuid PRIMARY KEY NOT NULL,
	"key" varchar(10) NOT NULL,
	"name" varchar(255) NOT NULL,
	"owner_id" uuid NOT NULL,
	"start_date" timestamp,
	"status" varchar DEFAULT 'ACTIVE' NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task" (
	"actual_hours" numeric,
	"board_id" uuid NOT NULL,
	"column_id" uuid NOT NULL,
	"completed_date" timestamp,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"description" varchar(255),
	"due_date" timestamp,
	"estimated_hours" numeric,
	"id" uuid PRIMARY KEY NOT NULL,
	"priority" varchar(255),
	"project_id" uuid NOT NULL,
	"start_date" timestamp,
	"status" varchar(255),
	"title" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"avatar" varchar(255) NOT NULL,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"email" varchar(255) NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"is_active" boolean NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"updated_at" timestamp NOT NULL,
	"username" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "board" ADD CONSTRAINT "board_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "column" ADD CONSTRAINT "column_board_id_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."board"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_board_id_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."board"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_column_id_column_id_fk" FOREIGN KEY ("column_id") REFERENCES "public"."column"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;