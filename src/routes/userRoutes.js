import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  restoreUser,
  searchUser,
  updateUser,
} from "../controllers/user.controller.js";
import { authorizeRoles } from "../middleware/auth.middleware.js";

const userRoutes = Router();
userRoutes.get("/search", authorizeRoles("admin", "user"), searchUser);
userRoutes.patch("/delete/:id", authorizeRoles("admin", "user"), deleteUser);
userRoutes.patch("/restore/:id", authorizeRoles("admin", "user"), restoreUser);

userRoutes.get("/", authorizeRoles("admin"), getAllUsers);
userRoutes.get("/:id", authorizeRoles("admin", "user"), getUser);
userRoutes.patch("/:id", authorizeRoles("admin", "user"), updateUser);

export default userRoutes;
