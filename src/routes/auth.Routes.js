import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller.js";
import { authToken } from "../middleware/auth.middleware.js";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authToken, logout);

export default router;
