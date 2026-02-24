import { eq, or, sql } from "drizzle-orm";
import { db } from "../../../shared/infrastructure/clients/drizzle.client";
import { userTable } from "../../../shared/infrastructure/orm/user.orm";
import type {
  CheckUserExistsRepository,
  GetUserByUsernameRepository,
  SignUpUserRepository,
} from "../../domain/repositories/user.repository";

export const checkUserExistsRepository: CheckUserExistsRepository = async ({
  username,
  email,
}) => {
  const user = await db
    .select()
    .from(userTable)
    .where(or(eq(userTable.username, username), eq(userTable.email, email)))
    .limit(1);

  if (user.length === 0) return undefined;

  return user[0];
};

export const getUserByUsernameRepository: GetUserByUsernameRepository = async (
  username,
) => {
  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.username, username))
    .limit(1);

  if (user.length === 0) return undefined;

  return user[0];
};

export const signUpUserRepository: SignUpUserRepository = async (userData) => {
  await db.insert(userTable).values({
    ...userData,
    updatedAt: sql`NOW()`,
  });
};
