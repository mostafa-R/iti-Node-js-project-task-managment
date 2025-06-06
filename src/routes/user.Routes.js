import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  restoreUser,
  searchUser,
  updateUser,
} from "../controllers/user.controller.js";
import {
  authorizeRoles,
  authorizeSelfOnly,
} from "../middleware/auth.middleware.js";

const userRoutes = Router();
userRoutes.get("/search", authorizeRoles("admin", "user"), searchUser);
userRoutes.patch(
  "/delete/:id",
  authorizeRoles("admin", "user"),
  authorizeSelfOnly(),
  deleteUser
);
userRoutes.patch(
  "/restore/:id",
  authorizeRoles("admin", "user"),
  authorizeSelfOnly(),
  restoreUser
);

userRoutes.get("/", authorizeRoles("admin"), getAllUsers);
userRoutes.get(
  "/:id",
  authorizeRoles("admin", "user"),
  authorizeSelfOnly(),
  getUser
);
userRoutes.patch(
  "/:id",
  authorizeRoles("admin", "user"),
  authorizeSelfOnly(),
  updateUser
);

export default userRoutes;
