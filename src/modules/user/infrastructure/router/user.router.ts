import type { FastifyPluginAsync } from "fastify";
import { signUpController } from "user/infrastructure/controllers/sign-up/sign-up.controller";

export const userRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/user", signUpController);
};
