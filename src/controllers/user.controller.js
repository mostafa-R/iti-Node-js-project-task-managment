import User from "../models/users.js";
import { paginate } from "../utils/pagination.js";

export const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json({ succes: true, user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const users = await paginate(User, { deletedAt: null }, { page, limit });

    res.status(200).json({ success: true, users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, restPassword, password } = req.body;
    const findUser = await User.findById(id);
    if (!findUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const updateUser = await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: { name, restPassword, password },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({ success: true, user: updateUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const findUser = await User.findById(id);
    if (!findUser) {
      return res.status(400).json({ message: "User not found" });
    }
    const user = await User.updateOne(
      { _id: id },
      {
        $set: { deletedAt: new Date() },
      }
    );
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const restoreUser = async (req, res) => {
  try {
    const id = req.params.id;
    const findUser = await User.findById(id);
    if (!findUser) {
      return res.status(400).json({ message: "User not found" });
    }
    const user = await User.updateOne(
      { _id: id },
      {
        $set: { deletedAt: null },
      }
    );
    res.status(200).json({ success: true, user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const searchUser = async (req, res) => {
  try {
    const search = req.query.search || "";
    const { page, limit } = req.query;

    const filter = {
      deletedAt: null,
      name: { $regex: search, $options: "i" },
    };

    const users = await paginate(User, filter, { page, limit });

    if (users.data.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({ users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
