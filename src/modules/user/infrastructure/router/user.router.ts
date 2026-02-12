import type { FastifyPluginAsync } from "fastify";
import { signInController } from "user/infrastructure/controllers/sign-in/sign-in.controller";
import { signUpController } from "user/infrastructure/controllers/sign-up/sign-up.controller";

export const userRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/user", signUpController);
  fastify.post("/user/sign-in", signInController);
};
