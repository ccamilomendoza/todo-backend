import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { projectTable } from "./project.orm";

export const boardTable = pgTable("board", {
  createAt: timestamp("create_at").notNull().defaultNow(),
  description: varchar("description", { length: 255 }),
  id: uuid("id").defaultRandom().primaryKey(),
  isDefault: boolean("is_default").notNull().default(false),
  name: varchar("name", { length: 255 }),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectTable.id),
  updatedAt: timestamp("updated_at").notNull(),
});
