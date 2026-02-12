import type {
  UserAlreadyExistsError,
  UserNotFoundError,
  WrongPasswordError,
} from "user/domain/types/user.types";

export const userAlreadyExists = (
  username: string,
): UserAlreadyExistsError => ({
  kind: "USER_ALREADY_EXISTS",
  message: `User with username "${username}" already exists`,
});

export const userNotFound = (username: string): UserNotFoundError => ({
  kind: "USER_NOT_FOUND",
  message: `The username or password is incorrect for user "${username}"`,
});

export const wrongPassword = (username: string): WrongPasswordError => ({
  kind: "WRONG_PASSWORD",
  message: `The username or password is incorrect for user "${username}"`,
});
