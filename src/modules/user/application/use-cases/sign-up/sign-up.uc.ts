import type { UserAlreadyExistsError } from "user/domain/types/user.types";
import { fail, ok } from "../../../../shared/domain/rules/result/result.rules";
import type { Result } from "../../../../shared/domain/types/result.type";
import type {
  GetUserByUsernameRepository,
  SignUpUserRepository,
} from "../../../domain/repositories/user.repository";
import { userAlreadyExists } from "../../../domain/rules/errors/errors.rules";
import type { HashService } from "../../../domain/services/hash.service";

interface SignUpUserUseCase {
  getUserByUsernameRepository: GetUserByUsernameRepository;
  hashService: HashService;
  signUpUserRepository: SignUpUserRepository;
}

export const signUpUserUseCase =
  ({
    getUserByUsernameRepository,
    hashService,
    signUpUserRepository,
  }: SignUpUserUseCase) =>
  async (
    userData: Parameters<SignUpUserRepository>[0],
  ): Promise<Result<void, UserAlreadyExistsError>> => {
    const user = await getUserByUsernameRepository(userData.username);

    if (user) return fail(userAlreadyExists(userData.username));

    const hashedPassword = await hashService(userData.password);

    await signUpUserRepository({ ...userData, password: hashedPassword });

    return ok(undefined);
  };
