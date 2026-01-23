import type { ErrorResponseDto } from "@/modules/shared/infrastructure/dtos/response.dto";
import {
  generateGetTodosUseCase,
  generatePostTodoUseCase,
} from "@/modules/todo/application/use-cases/todo.uc";
import type { Todo } from "@/modules/todo/domain/entities/todo.entity";
import { getTodosPostgresRepository } from "@/modules/todo/infrastructure/db/todo.db";
import { postTodoSqlLiteRepository } from "@/modules/todo/infrastructure/repositories/todo.repository";
import { todoSchema } from "@/modules/todo/infrastructure/schemas/todo.schema";
import type { RouteHandler } from "fastify";

const getTodosUseCase = generateGetTodosUseCase({
  getTodosRepository: getTodosPostgresRepository,
});

export const getTodosController: RouteHandler<{
  Reply: Array<Todo> | ErrorResponseDto;
}> = async (_request, response) => {
  try {
    const todos = await getTodosUseCase();

    return response.status(200).send(todos);
  } catch (_error) {
    return response.status(500).send({ message: "Server Error" });
  }
};

const postTodoUseCase = generatePostTodoUseCase({
  postTodoRepository: postTodoSqlLiteRepository,
});

export const postTodoController: RouteHandler<{
  Body: Todo;
  Reply: ErrorResponseDto;
}> = async (request, response) => {
  const requestBody = request.body;

  const validate = todoSchema.safeParse(requestBody);

  if (!validate.success) {
    response.status(422).send({ message: "Wrong Todo Format" });

    return;
  }

  try {
    await postTodoUseCase(validate.data);
  } catch (_error) {
    response.status(500).send({ message: "Server Error" });
  }
};
