import express from "express";
import { todoRouter } from "./modules/todo/infrastructure/router/todo.router";

const app = express();

const API_NAME = "/architecture/todo";

app.use(API_NAME, todoRouter);
