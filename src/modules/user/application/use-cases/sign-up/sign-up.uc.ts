import { fail, ok } from "../../../../shared/domain/rules/result/result.rules";
import type { Result } from "../../../../shared/domain/types/result.type";
import type {
  CheckUserExistsRepository,
  SignUpUserRepository,
} from "../../../domain/repositories/user.repository";
import {
  emailAlreadyExists,
  userAlreadyExists,
} from "../../../domain/rules/errors/errors.rules";
import type { HashService } from "../../../domain/services/hash.service";
import type {
  EmailAlreadyExistsError,
  UserAlreadyExistsError,
} from "../../../domain/types/errors.types";

interface SignUpUserUseCase {
  checkUserExistsRepository: CheckUserExistsRepository;
  hashService: HashService;
  signUpUserRepository: SignUpUserRepository;
}

export const signUpUserUseCase =
  ({
    checkUserExistsRepository,
    hashService,
    signUpUserRepository,
  }: SignUpUserUseCase) =>
  async (
    userData: Parameters<SignUpUserRepository>[0],
  ): Promise<
    Result<void, EmailAlreadyExistsError | UserAlreadyExistsError>
  > => {
    const user = await checkUserExistsRepository({
      email: userData.email,
      username: userData.username,
    });

    if (user) {
      if (user.username === userData.username) {
        return fail(userAlreadyExists(userData.username));
      }
      if (user.email === userData.email) {
        return fail(emailAlreadyExists(userData.email));
      }
    }

    const hashedPassword = await hashService(userData.password);

    await signUpUserRepository({ ...userData, password: hashedPassword });

    return ok(undefined);
  };
