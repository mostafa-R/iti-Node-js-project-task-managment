import Category from "../models/category.js";
import Task from "../models/task.js";
import { paginate } from "../utils/pagination.js";

export async function createTask(req, res) {
  try {
    const { title, description, category, status, dueDate, priority } =
      req.body;

    const userId = req.user.id;
    let categoryDoc = null;

    if (category) {
      categoryDoc = await Category.findOne({ name: category, user: userId });
      if (!categoryDoc) {
        categoryDoc = await Category.create({ name: category, user: userId });
      }
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      status,
      user: userId,
      category: categoryDoc?._id || null,
    });

    res.status(201).json(task);
  } catch (error) {
    res
      .status(500)
      .json({ message: "some thing error ", error: error.message });
  }
}

export async function getTask(req, res) {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getTasks(req, res) {
  try {
    const { status, priority, category, search, page, limit } = req.query;
    const query = { user: req.user.id };
    console.log("Query:", req.query);

    let categoryName;
    if (category && typeof category === "string") {
      categoryName = await Category.findOne({
        name: { $regex: category, $options: "i" },
      });

      if (categoryName) query.category = categoryName._id;
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { priority: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
      ];
    }

    const tasks = await paginate(Task, query, {
      page,
      limit,
    });

    res.json({ success: true, ...tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateTask(req, res) {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteTask(req, res) {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
