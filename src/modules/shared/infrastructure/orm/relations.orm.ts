import { boardTable } from "@/modules/shared/infrastructure/orm/board.orm";
import { columnTable } from "@/modules/shared/infrastructure/orm/column.orm";
import { projectTable } from "@/modules/shared/infrastructure/orm/project.orm";
import { taskTable } from "@/modules/shared/infrastructure/orm/task.orm";
import { userTable } from "@/modules/shared/infrastructure/orm/user.orm";
import { relations } from "drizzle-orm";

export const boardRelations = relations(boardTable, ({ many, one }) => ({
  columns: many(columnTable),
  project: one(projectTable, {
    fields: [boardTable.projectId],
    references: [projectTable.id],
  }),
}));

export const columnRelations = relations(columnTable, ({ many, one }) => ({
  board: one(boardTable, {
    fields: [columnTable.boardId],
    references: [boardTable.id],
  }),
  tasks: many(taskTable),
}));

export const projectRelations = relations(projectTable, ({ many, one }) => ({
  boards: many(boardTable),
  owner: one(userTable, {
    fields: [projectTable.ownerId],
    references: [userTable.id],
  }),
}));

export const taskRelations = relations(taskTable, ({ one }) => ({
  board: one(boardTable, {
    fields: [taskTable.boardId],
    references: [boardTable.id],
  }),
  column: one(columnTable, {
    fields: [taskTable.columnId],
    references: [columnTable.id],
  }),
  project: one(projectTable, {
    fields: [taskTable.projectId],
    references: [projectTable.id],
  }),
}));

export const userRelations = relations(userTable, ({ many }) => ({
  projects: many(projectTable),
}));
