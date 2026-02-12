import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { userTable } from "./user.orm";

export const projectTable = pgTable("project", {
  color: varchar("color", { length: 7 }),
  createAt: timestamp("create_at").notNull().defaultNow(),
  description: varchar("description", { length: 255 }),
  endDate: timestamp("end_date"),
  id: uuid("id").defaultRandom().primaryKey(),
  key: varchar("key", { length: 10 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => userTable.id),
  startDate: timestamp("start_date"),
  status: varchar("status", {
    enum: ["ACTIVE", "ARCHIVED", "COMPLETED", "ON_HOLD"],
  })
    .default("ACTIVE")
    .notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});
