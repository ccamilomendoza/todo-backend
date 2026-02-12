import {
  numeric,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { boardTable } from "./board.orm";
import { columnTable } from "./column.orm";
import { projectTable } from "./project.orm";

export const taskTable = pgTable("task", {
  actualHours: numeric("actual_hours"),
  boardId: uuid("board_id")
    .notNull()
    .references(() => boardTable.id),
  columnId: uuid("column_id")
    .notNull()
    .references(() => columnTable.id),
  completedDate: timestamp("completed_date"),
  createAt: timestamp("create_at").notNull().defaultNow(),
  description: varchar("description", { length: 255 }),
  dueDate: timestamp("due_date"),
  estimatedHours: numeric("estimated_hours"),
  id: uuid("id").defaultRandom().primaryKey(),
  priority: varchar("priority", {
    enum: ["critical", "high", "low", "medium"],
    length: 255,
  }),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectTable.id),
  startDate: timestamp("start_date"),
  status: varchar("status", {
    enum: ["blocked", "cancelled", "done", "in-progress", "to-do"],
    length: 255,
  }),
  title: varchar("title", { length: 255 }).notNull(),
  type: varchar("type", {
    enum: ["bug", "epic", "story", "subtask", "task"],
    length: 255,
  }).notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});
