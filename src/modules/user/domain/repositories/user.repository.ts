import type { UserEntity } from "../entities/user.entity";
import type {
  CreateUserPayload,
  UserCredentialsPayload,
} from "../types/payloads.types";

interface CheckUserExistsRepositoryArgs {
  username: string;
  email: string;
}

export type CheckUserExistsRepository = (
  args: CheckUserExistsRepositoryArgs,
) => Promise<UserEntity | undefined>;

export type SignUpUserRepository = (user: CreateUserPayload) => Promise<void>;

export type GetUserByUsernameRepository = (
  username: string,
) => Promise<UserEntity | undefined>;

export type SignInUserRepository = (
  user: UserCredentialsPayload,
) => Promise<UserEntity>;
