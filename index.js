import cookieParser from "cookie-parser";
import cors from "cors";
import dontenv from "dotenv";
import express from "express";
import { connectDB } from "./src/config/db.js";
import { authToken } from "./src/middleware/auth.middleware.js";
import authRouter from "./src/routes/auth.Routes.js";
import taskRouter from "./src/routes/task.Routes.js";
import userRouter from "./src/routes/user.Routes.js";

dontenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status).json(err.error || 500);
  next();
});

app.use("/", authRouter);
app.use(authToken);
app.use("/user", userRouter);
app.use("/task", taskRouter);

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
