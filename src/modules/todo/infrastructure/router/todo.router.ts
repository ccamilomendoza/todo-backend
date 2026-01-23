import {
  getTodosController,
  postTodoController,
} from "@/modules/todo/infrastructure/controllers/todo.controller";
import type { FastifyPluginAsync } from "fastify";

export const todoRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/todo", getTodosController);
  fastify.post("/todo", postTodoController);
};
