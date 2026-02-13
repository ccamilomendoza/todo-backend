import cors from "@fastify/cors";
import Fastify from "fastify";
import { userRoutes } from "user/infrastructure/router/user.router";

const fastify = Fastify({
  logger: true,
});

const start = async () => {
  try {
    await fastify.register(cors, {
      origin: "*",
    });

    await fastify.register(userRoutes);

    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
