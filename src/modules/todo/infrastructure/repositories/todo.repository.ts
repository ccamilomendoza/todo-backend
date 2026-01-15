import { db } from "@/modules/shared/infrastructure/clients/drizzle.client";
import { todoTable } from "@/modules/shared/infrastructure/db/schemas";
import type { Todo } from "@/modules/todo/domain/entities/todo.entity";
import type {
  GetTodosRepository,
  PostTodoRepository,
} from "@/modules/todo/domain/repositories/todo.repository";

export const getTodosSqlLiteRepository: GetTodosRepository = async () =>
  (await db.select().from(todoTable)) as Array<Todo>;

export const postTodoSqlLiteRepository: PostTodoRepository = async (todo) => {
  await db.insert(todoTable).values(todo);
};
