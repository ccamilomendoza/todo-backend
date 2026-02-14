import type { RouteHandler } from "fastify";
import type { z } from "zod/v4";
import { signInUserUseCase } from "../../../application/use-cases/sign-in/sign-in.uc";
import { getUserByUsernameRepository } from "../../data-base/user.db";
import { signInUserSchema } from "../../schemas/user.schema";
import { compareHashService } from "../../services/bcrypt.service";
import { generateTokenService } from "../../services/jwt.service";

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
