const Task = require('../models/task');

async function createTask(req, res) {
  try {
    const { title, description, dueDate, priority, status, category } = req.body;

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      status,
      category,
      user: req.user.id
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getTasks(req, res) {
  try {
    const { status, priority, category, search } = req.query;
    const query = { user: req.user.id };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(query).sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateTask(req, res) {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteTask(req, res) {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask
};

