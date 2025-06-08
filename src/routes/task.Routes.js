import  express from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../controllers/task.controller.js";

const taskRouter = express.Router();

taskRouter.post("/", createTask);
taskRouter.get("/", getTasks);
taskRouter.patch("/:id", updateTask);
taskRouter.delete("/:id", deleteTask);

export default taskRouter;
