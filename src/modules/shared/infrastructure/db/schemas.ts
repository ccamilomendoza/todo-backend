import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todoTable = sqliteTable("users_table", {
  createdAt: text("create_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  description: text("description").notNull(),
  id: int("id").primaryKey({ autoIncrement: true }),
  status: text("status").notNull(),
  title: text("title").notNull(),
});
