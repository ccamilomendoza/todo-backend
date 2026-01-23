import Fastify from "fastify";
import { todoRoutes } from "./modules/todo/infrastructure/router/todo.router";

const fastify = Fastify({
  logger: true,
});

fastify.register(todoRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
