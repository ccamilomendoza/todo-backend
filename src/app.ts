import cors from "@fastify/cors";
import Fastify, { type FastifyInstance } from "fastify";
import { userRoutes } from "./modules/user/infrastructure/router/user.router";

export const buildApp = (): FastifyInstance => {
  const fastify = Fastify({
    logger: true,
  });

  fastify.register(cors, {
    origin: "*",
  });
  fastify.register(userRoutes);

  return fastify;
};
