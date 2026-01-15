import type { Todo } from "@/modules/todo/domain/entities/todo.entity";
import type {
  GetTodosRepository,
  PostTodoRepository,
} from "@/modules/todo/domain/repositories/todo.repository";

interface UseCaseGetTodos {
  getTodosRepository: GetTodosRepository;
}

export const generateGetTodosUseCase =
  ({ getTodosRepository }: UseCaseGetTodos) =>
  async () => {
    return await getTodosRepository();
  };

interface GeneratePostTodoUseCase {
  postTodoRepository: PostTodoRepository;
}

export const generatePostTodoUseCase =
  ({ postTodoRepository }: GeneratePostTodoUseCase) =>
  async (todo: Todo) => {
    await postTodoRepository(todo);
  };
