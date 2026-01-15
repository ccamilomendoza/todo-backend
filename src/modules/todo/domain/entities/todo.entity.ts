export interface Todo {
  createdAt: string;
  description: string;
  status: "done" | "progress" | "todo";
  title: string;
}
