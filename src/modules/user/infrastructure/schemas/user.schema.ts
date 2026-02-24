import { createInsertSchema } from "drizzle-zod";
import { userTable } from "../../../shared/infrastructure/orm/user.orm";

export const signUpUserSchema = createInsertSchema(userTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isActive: true,
});

export const signInUserSchema = createInsertSchema(userTable).pick({
  username: true,
  password: true,
});
