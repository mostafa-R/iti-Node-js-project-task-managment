import User from "../models/users.js";

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
    const users = await User.find({ deletedAt: null });
    res.status(200).json({ succes: true, users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, role, restPassword, password } = req.body;
    const findUser = await User.findById(id);
    if (!findUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = await User.updateOne(
      { _id: id },
      {
        $set: { name, role, restPassword, password },
      }
    );
    res.status(200).json({ success: true, user });
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
    const users = await User.find({ name: { $regex: search, $options: "i" } });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
