import type { RouteHandler } from "fastify";
import { signUpUserUseCase } from "user/application/use-cases/sign-up/sign-up.uc";
import {
  getUserByUsernameRepository,
  signUpUserRepository,
} from "user/infrastructure/data-base/user.db";
import { signUpUserSchema } from "user/infrastructure/schemas/user.schema";
import { hashService } from "user/infrastructure/services/bcrypt.service";
import type { z } from "zod/v4";

export const signUpController: RouteHandler<{
  Body: z.infer<typeof signUpUserSchema>;
  Reply: { message: string };
}> = async (request, response) => {
  const userData = request.body;

  const validate = signUpUserSchema.safeParse(userData);

  if (!validate.success) {
    response.code(400).send({ message: "Wrong Body Format" });

    return;
  }

  try {
    const result = await signUpUserUseCase({
      getUserByUsernameRepository,
      hashService,
      signUpUserRepository,
    })(validate.data);

    if (!result.success) {
      response.code(409).send({ message: result.error.message });

      return;
    }

    response.status(201).send({ message: "User Created Successfully" });
  } catch (_error) {
    response.code(500).send({ message: "Internal Server Error" });
  }
};
