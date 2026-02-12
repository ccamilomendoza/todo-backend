export type UserAlreadyExistsError = {
  kind: "USER_ALREADY_EXISTS";
  message: string;
};

export type UserNotFoundError = {
  kind: "USER_NOT_FOUND";
  message: string;
};

export type WrongPasswordError = {
  kind: "WRONG_PASSWORD";
  message: string;
};
