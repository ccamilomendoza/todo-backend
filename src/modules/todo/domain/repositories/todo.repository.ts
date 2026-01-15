import type { Todo } from "@/modules/todo/domain/entities/todo.entity";

export type GetTodosRepository = () => Promise<Array<Todo>>;

export type PostTodoRepository = (todo: Todo) => Promise<void>;
