import type { UserEntity } from "../entities/user.entity";

export interface AuthResponsePayload {
  token: string;
}

export type CreateUserPayload = Omit<
  UserEntity,
  "createdAt" | "id" | "isActive" | "updatedAt"
>;

export type UserCredentialsPayload = Pick<UserEntity, "username" | "password">;
