import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const todoTable = pgTable("todo", {
  createAt: timestamp("create_at").notNull().defaultNow(),
  description: varchar("description", { length: 255 }).notNull(),
  id: uuid().primaryKey(),
  status: varchar("status", { enum: ["done", "progress", "todo"] }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
});
