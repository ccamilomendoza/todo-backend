import { createInsertSchema } from "drizzle-zod";
import { userTable } from "../../../shared/infrastructure/orm/user.orm";

export const signUpUserSchema = createInsertSchema(userTable);

export const signInUserSchema = signUpUserSchema.pick({
  username: true,
  password: true,
});
