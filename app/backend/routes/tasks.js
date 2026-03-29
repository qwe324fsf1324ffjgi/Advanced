// app/backend/routes/tasks.js
const express = require("express");
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require("../utils/dbHandler");

const router = express.Router();

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

router.get("/", (req, res) => {
  const tasks = getAllTasks();

  res.status(200).json({
    success: true,
    data: tasks
  });
});

router.get("/:id", (req, res) => {
  const task = getTaskById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  res.status(200).json({
    success: true,
    data: task
  });
});

router.post("/", (req, res) => {
  const { title, description, priority, status, dueDate } = req.body;

  if (!isNonEmptyString(title)) {
    return res.status(400).json({
      success: false,
      message: "Title is required"
    });
  }

  const newTask = createTask({
    title,
    description,
    priority,
    status,
    dueDate
  });

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: newTask
  });
});

router.put("/:id", (req, res) => {
  const { title, description, priority, status, dueDate } = req.body;

  if (title !== undefined && !isNonEmptyString(title)) {
    return res.status(400).json({
      success: false,
      message: "Title cannot be empty"
    });
  }

  const updatedTask = updateTask(req.params.id, {
    title,
    description,
    priority,
    status,
    dueDate
  });

  if (!updatedTask) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    data: updatedTask
  });
});

router.delete("/:id", (req, res) => {
  const deletedTask = deleteTask(req.params.id);

  if (!deletedTask) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
    data: deletedTask
  });
});

module.exports = router;