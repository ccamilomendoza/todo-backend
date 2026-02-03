import type {
  GetUserByUsernameRepository,
  SignUpUserRepository,
} from "user/domain/repositories/user.repository";

interface SignUpUserUseCase {
  getUserByUsernameRepository: GetUserByUsernameRepository;
  signUpUserRepository: SignUpUserRepository;
}

export const signUpUserUseCase =
  ({ getUserByUsernameRepository, signUpUserRepository }: SignUpUserUseCase) =>
  async (
    userData: Parameters<SignUpUserRepository>[0],
  ): Promise<{ description: string; status: "error" | "success" }> => {
    try {
      const user = await getUserByUsernameRepository(userData.username);

      if (user)
        return {
          description: "Application Error",
          status: "error",
        };

      await signUpUserRepository(userData);

      return {
        description: "",
        status: "success",
      };
    } catch (_error) {
      return {
        description: "Application Error",
        status: "error",
      };
    }
  };
