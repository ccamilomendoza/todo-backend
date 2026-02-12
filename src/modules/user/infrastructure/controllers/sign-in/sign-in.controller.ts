import type { RouteHandler } from "fastify";
import { signInUserUseCase } from "user/application/use-cases/sign-in/sign-in.uc";
import { getUserByUsernameRepository } from "user/infrastructure/data-base/user.db";
import { signInUserSchema } from "user/infrastructure/schemas/user.schema";
import { compareHashService } from "user/infrastructure/services/bcrypt.service";
import { generateTokenService } from "user/infrastructure/services/jwt.service";
import type { z } from "zod/v4";

export const signInController: RouteHandler<{
  Body: z.infer<typeof signInUserSchema>;
  Reply: { token: string } | { message: string };
}> = async (request, response) => {
  const userData = request.body;

  const validate = signInUserSchema.safeParse(userData);

  if (!validate.success) {
    response.status(400).send({ message: "Invalid credentials format" });

    return;
  }

  try {
    const result = await signInUserUseCase({
      getUserByUsernameRepository,
      compareHashService,
      generateTokenService,
    })(validate.data);

    if (!result.success) {
      response.status(401).send({ message: result.error.message });

      return;
    }

    response.status(200).send({ token: result.value.token });
  } catch (_error) {
    response.status(500).send({ message: "Internal server error" });
  }
};
