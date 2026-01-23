import { MAX_DESCRIPTION_LENGTH } from "@/modules/todo/domain/business/todo.bl";
import type { Todo } from "@/modules/todo/domain/entities/todo.entity";
import { z } from "zod/v4";

export const todoSchema = z.object({
  description: z.string().max(MAX_DESCRIPTION_LENGTH),
  status: z.enum(["done", "progress", "todo"]),
  title: z.string(),
}) satisfies z.ZodType<Omit<Todo, "createdAt">>;
