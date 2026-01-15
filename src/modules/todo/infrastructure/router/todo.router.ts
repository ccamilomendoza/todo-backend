import {
  getTodosController,
  postTodoController,
} from "@/modules/todo/infrastructure/controllers/todo.controller";
import { Router } from "express";

export const todoRouter = Router();

todoRouter.get("/", getTodosController);
todoRouter.post("/", postTodoController);
