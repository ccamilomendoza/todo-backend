import type { UserEntity } from "user/domain/entities/user.entity";

export type SignUpUserRepository = (
  user: Omit<UserEntity, "createdAt" | "updatedAt">,
) => Promise<void>;

export type GetUserRepository = (id: string) => Promise<UserEntity>;

export type GetUserByUsernameRepository = (
  username: string,
) => Promise<UserEntity | undefined>;

export type SignInUserRepository = (
  user: Pick<UserEntity, "password" | "username">,
) => Promise<UserEntity>;
