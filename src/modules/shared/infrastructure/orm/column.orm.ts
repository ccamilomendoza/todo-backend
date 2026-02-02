import {
  numeric,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { boardTable } from "./board.orm";

export const columnTable = pgTable("column", {
  boardId: uuid("board_id")
    .notNull()
    .references(() => boardTable.id),
  createAt: timestamp("create_at").notNull().defaultNow(),
  id: uuid("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  position: numeric().notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});
