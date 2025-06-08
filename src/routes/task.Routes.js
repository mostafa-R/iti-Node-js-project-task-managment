import express from "express";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "../controllers/task.controller.js";
import { authorizeRoles } from "../middleware/auth.middleware.js";

const taskRouter = express.Router();

taskRouter.post("/", authorizeRoles("admin", "user"), createTask);
taskRouter.get("/", authorizeRoles("admin", "user"), getTasks);
taskRouter.get("/:id", authorizeRoles("admin", "user"), getTask);
taskRouter.patch("/:id", authorizeRoles("admin", "user"), updateTask);
taskRouter.delete("/:id", authorizeRoles("admin", "user"), deleteTask);

export default taskRouter;
