import Fastify from "fastify";
import { userRoutes } from "./modules/user/infrastructure/router/user.router";

const fastify = Fastify({
  logger: true,
});

fastify.register(userRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
