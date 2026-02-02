import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

// id: Unique identifier for the project (Primary Key)
// name: Project name (max 200 characters)
// description: Detailed project description (optional)
// key: Unique project key/code for task prefixes (max 10 characters, e.g., "PROJ")
// status: Project status (default: "Active", valid values: Active, Archived, Completed, On Hold)
// startDate: Project start date (optional)
// endDate: Project end date (optional)
// color: Color code for UI representation (optional, max 7 characters, e.g., "#FF5733")
// ownerId: Foreign key referencing the User who owns the project
// createdAt: Timestamp when the project was created
// updatedAt: Timestamp when the project was last updated

export const projectTable = pgTable("project", {
  description: varchar("description", { length: 255 }),
  createAt: timestamp("create_at").notNull().defaultNow(),
  key: varchar("key", { length: 10 }).notNull(),
  id: uuid().primaryKey(),
  updatedAt: timestamp("updated_at").notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  color: varchar("color", { length: 7 }),
  status: varchar("status", {
    enum: ["ACTIVE", "ARCHIVED", "COMPLETED", "ON_HOLD"],
  })
    .default("ACTIVE")
    .notNull(),
});
