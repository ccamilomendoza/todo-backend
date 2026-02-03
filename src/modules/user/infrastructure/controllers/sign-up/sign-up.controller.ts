import type { RouteHandler } from "fastify";
import { signUpUserUseCase } from "user/application/use-cases/sign-up/sign-up.uc";
import type { SignUpUserRepository } from "user/domain/repositories/user.repository";
import {
  getUserByUsernameRepository,
  signUpUserRepository,
} from "user/infrastructure/data-base/user.db";
import { signUpUserSchema } from "user/infrastructure/schemas/user.schema";

export const signUpController: RouteHandler<{
  Body: Parameters<SignUpUserRepository>[0];
}> = async (request, response) => {
  const userData = request.body;

  const validate = signUpUserSchema.safeParse(userData);

  if (!validate.success) {
    response.code(400).send({ message: "Wrong Body" });

    return;
  }

  const result = await signUpUserUseCase({
    getUserByUsernameRepository,
    signUpUserRepository,
  })(validate.data);

  console.log({ result });
};
