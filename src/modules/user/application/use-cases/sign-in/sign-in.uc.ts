import { fail, ok } from "shared/domain/rules/result/result.rules";
import type { Result } from "shared/domain/types/result.type";
import type { GetUserByUsernameRepository } from "user/domain/repositories/user.repository";
import {
  userNotFound,
  wrongPassword,
} from "user/domain/rules/errors/errors.rules";
import type { CompareHashService } from "user/domain/services/hash.service";
import type { GenerateTokenService } from "user/domain/services/token.service";
import type {
  UserNotFoundError,
  WrongPasswordError,
} from "user/domain/types/user.types";

interface SignInUserUseCaseDeps {
  compareHashService: CompareHashService;
  generateTokenService: GenerateTokenService;
  getUserByUsernameRepository: GetUserByUsernameRepository;
}

export const signInUserUseCase =
  ({
    compareHashService,
    generateTokenService,
    getUserByUsernameRepository,
  }: SignInUserUseCaseDeps) =>
  async (credentials: {
    username: string;
    password: string;
  }): Promise<
    Result<{ token: string }, UserNotFoundError | WrongPasswordError>
  > => {
    const user = await getUserByUsernameRepository(credentials.username);

    if (!user) return fail(userNotFound(credentials.username));

    const isValidPassword = await compareHashService({
      hashed: user.password,
      plain: credentials.password,
    });

    if (!isValidPassword) return fail(wrongPassword(credentials.username));

    const token = generateTokenService({
      username: user.username,
      email: user.email,
    });

    return ok({ token });
  };
