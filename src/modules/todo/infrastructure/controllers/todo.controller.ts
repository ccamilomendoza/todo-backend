import {
  generateGetTodosUseCase,
  generatePostTodoUseCase,
} from "@/modules/todo/application/use-cases/todo.uc";
import type { Todo } from "@/modules/todo/domain/entities/todo.entity";
import { getTodosPostgresRepository } from "@/modules/todo/infrastructure/db/todo.db";
import { postTodoSqlLiteRepository } from "@/modules/todo/infrastructure/repositories/todo.repository";
import { todoSchema } from "@/modules/todo/infrastructure/schemas/todo.schema";
import type { RequestHandler } from "express";

const getTodosUseCase = generateGetTodosUseCase({
  getTodosRepository: getTodosPostgresRepository,
});

export const getTodosController: RequestHandler<unknown, Array<Todo>> = async (
  _req,
  res
) => {
  const todos = await getTodosUseCase();

  res.status(200).json(todos);
};

const postTodoUseCase = generatePostTodoUseCase({
  postTodoRepository: postTodoSqlLiteRepository,
});

export const postTodoController: RequestHandler<
  unknown,
  { message: string; status: number },
  Todo
> = async (req, res) => {
  const requestBody = req.body;

  const validate = todoSchema.safeParse(requestBody);

  if (!validate.success) {
    res.status(422).json({ message: "Wrong Todo Format", status: 422 });

    return;
  }

  try {
    await postTodoUseCase(validate.data);
  } catch (_error) {
    res.status(500).json({ message: "Server Error", status: 500 });
  }
};
