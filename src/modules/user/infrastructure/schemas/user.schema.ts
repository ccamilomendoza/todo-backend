import { createInsertSchema } from "drizzle-zod";
import { userTable } from "shared/infrastructure/orm/user.orm";
import z from "zod";

export const signUpUserSchema = createInsertSchema(userTable, {
  updatedAt: () => z.date().optional(),
});
