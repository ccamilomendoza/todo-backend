import { fail, ok } from "../../../../shared/domain/rules/result/result.rules";
import type { Result } from "../../../../shared/domain/types/result.type";
import type { GetUserByUsernameRepository } from "../../../domain/repositories/user.repository";
import {
  userNotFound,
  wrongPassword,
} from "../../../domain/rules/errors/errors.rules";
import type { CompareHashService } from "../../../domain/services/hash.service";
import type { GenerateTokenService } from "../../../domain/services/token.service";
import type {
  UserNotFoundError,
  WrongPasswordError,
} from "../../../domain/types/errors.types";
import type {
  AuthResponsePayload,
  UserCredentialsPayload,
} from "../../../domain/types/payloads.types";

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
  async (
    credentials: UserCredentialsPayload,
  ): Promise<
    Result<AuthResponsePayload, UserNotFoundError | WrongPasswordError>
  > => {
    const user = await getUserByUsernameRepository(credentials.username);

    if (!user) return fail(userNotFound(credentials.username));

    const isValidPassword = await compareHashService({
      hashed: user.password,
      plain: credentials.password,
    });

    if (!isValidPassword) return fail(wrongPassword(credentials.username));

    const token = generateTokenService({
      email: user.email,
      id: user.id,
      username: user.username,
    });

    return ok({ token });
  };
