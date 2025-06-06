import jwt from "jsonwebtoken";
import { setJwtCookie } from "./cookie.js";

export const generateToken = (user, res) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  setJwtCookie(res, token);
  return token;
};

export const verifyToken = (token) => {
  if (!token) {
    throw new Error("No token provided");
  }
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.verify(token, process.env.JWT_SECRET);
};
