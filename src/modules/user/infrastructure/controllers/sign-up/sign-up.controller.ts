import type { RouteHandler } from "fastify";
import type { z } from "zod/v4";
import { signUpUserUseCase } from "../../../application/use-cases/sign-up/sign-up.uc";
import {
  checkUserExistsRepository,
  signUpUserRepository,
} from "../../data-base/user.db";
import type { signUpUserSchema } from "../../schemas/user.schema";
import { hashService } from "../../services/bcrypt.service";

export const signUpController: RouteHandler<{
  Body: z.infer<typeof signUpUserSchema>;
  Reply: { message: string };
}> = async (request, response) => {
  const userData = request.body;

  try {
    const result = await signUpUserUseCase({
      checkUserExistsRepository,
      hashService,
      signUpUserRepository,
    })(userData);

    if (!result.success) {
      response.code(409).send({ message: result.error.message });

      return;
    }

    response.status(201).send({ message: "User Created Successfully" });
  } catch (_error) {
    response.code(500).send({ message: "Internal Server Error" });
  }
};
