import type { GetTodosRepository } from "@/modules/todo/domain/repositories/todo.repository";

export const getTodosPostgresRepository: GetTodosRepository = async () => {
  return [
    {
      createdAt: "05-05-2025",
      description: "Description",
      status: "done",
      title: "Title",
    },
  ];
};
