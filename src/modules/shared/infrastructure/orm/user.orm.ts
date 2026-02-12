import {
  boolean,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userTable = pgTable(
  "user",
  {
    avatar: varchar("avatar", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    id: uuid("id").defaultRandom().primaryKey(),
    isActive: boolean("is_active").notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    username: varchar("username", { length: 255 }).notNull().unique(),
  },
  (table) => [uniqueIndex("username_idx").on(table.username)],
);
