//auth controller for register and login user logic
import User from "../models/users.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { clearJwtCookie } from "../utils/cookie.js";
import { generateToken } from "../utils/jwtHelpers.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(400).json({ message: "something went wrong", error: err });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email or password is incorrect" });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Email or password is incorrect" });
    }

    if (user.deletedAt !== null) {
      return res.status(400).json({
        message:
          "User is deleted, you can not login. You can restore it again.",
      });
    }
    
    const token = generateToken(user, res);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    res
      .status(401)
      .json({ message: "something went wrong", error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    clearJwtCookie(res);
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong during logout.",
      error: error.message,
    });
  }
};
