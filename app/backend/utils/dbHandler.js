// app/backend/utils/dbHandler.js
const fs = require("fs");
const path = require("path");

const tasksFilePath = process.env.TASKS_FILE
  ? path.resolve(process.cwd(), process.env.TASKS_FILE)
  : path.resolve(__dirname, "../../../db/tasks.json");

function ensureTasksFile() {
  const directoryPath = path.dirname(tasksFilePath);

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
    console.log(`[dbHandler] Created directory: ${directoryPath}`);
  }

  if (!fs.existsSync(tasksFilePath)) {
    fs.writeFileSync(tasksFilePath, "[]", "utf8");
    console.log(`[dbHandler] Created tasks file: ${tasksFilePath}`);
  }
}

function readTasksFile() {
  ensureTasksFile();

  try {
    const fileContent = fs.readFileSync(tasksFilePath, "utf8").trim();

    if (!fileContent) {
      return [];
    }

    const parsedTasks = JSON.parse(fileContent);
    return Array.isArray(parsedTasks) ? parsedTasks : [];
  } catch (error) {
    console.error("[dbHandler] Failed to read tasks file:", error.message);
    return [];
  }
}

function writeTasksFile(tasks) {
  ensureTasksFile();
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2), "utf8");
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePriority(priority) {
  const allowedPriorities = ["low", "medium", "high"];
  const value = normalizeText(priority).toLowerCase();
  return allowedPriorities.includes(value) ? value : "medium";
}

function normalizeStatus(status) {
  const allowedStatuses = ["pending", "in-progress", "completed"];
  const value = normalizeText(status).toLowerCase();
  return allowedStatuses.includes(value) ? value : "pending";
}

function normalizeDueDate(dueDate) {
  if (!dueDate) {
    return "";
  }

  const value = normalizeText(dueDate);
  return value;
}

function createTaskId() {
  return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

function buildTaskPayload(input) {
  const now = new Date().toISOString();

  return {
    id: createTaskId(),
    title: normalizeText(input.title),
    description: normalizeText(input.description),
    priority: normalizePriority(input.priority),
    status: normalizeStatus(input.status),
    dueDate: normalizeDueDate(input.dueDate),
    createdAt: now,
    updatedAt: now
  };
}

function getAllTasks() {
  const tasks = readTasksFile();
  console.log(`[dbHandler] Loaded ${tasks.length} task(s)`);
  return tasks;
}

function getTaskById(id) {
  const tasks = readTasksFile();
  const task = tasks.find((item) => item.id === String(id)) || null;
  console.log(`[dbHandler] Lookup task by id: ${id} -> ${task ? "found" : "not found"}`);
  return task;
}

function createTask(taskData) {
  const tasks = readTasksFile();
  const newTask = buildTaskPayload(taskData);

  tasks.push(newTask);
  writeTasksFile(tasks);

  console.log(`[dbHandler] Created task: ${newTask.id}`);
  return newTask;
}

function updateTask(id, updates) {
  const tasks = readTasksFile();
  const taskIndex = tasks.findIndex((item) => item.id === String(id));

  if (taskIndex === -1) {
    console.log(`[dbHandler] Update failed. Task not found: ${id}`);
    return null;
  }

  const existingTask = tasks[taskIndex];
  const updatedTask = {
    ...existingTask,
    title:
      updates.title !== undefined
        ? normalizeText(updates.title)
        : existingTask.title,
    description:
      updates.description !== undefined
        ? normalizeText(updates.description)
        : existingTask.description,
    priority:
      updates.priority !== undefined
        ? normalizePriority(updates.priority)
        : existingTask.priority,
    status:
      updates.status !== undefined
        ? normalizeStatus(updates.status)
        : existingTask.status,
    dueDate:
      updates.dueDate !== undefined
        ? normalizeDueDate(updates.dueDate)
        : existingTask.dueDate,
    updatedAt: new Date().toISOString()
  };

  tasks[taskIndex] = updatedTask;
  writeTasksFile(tasks);

  console.log(`[dbHandler] Updated task: ${id}`);
  return updatedTask;
}

function deleteTask(id) {
  const tasks = readTasksFile();
  const taskIndex = tasks.findIndex((item) => item.id === String(id));

  if (taskIndex === -1) {
    console.log(`[dbHandler] Delete failed. Task not found: ${id}`);
    return null;
  }

  const deletedTask = tasks[taskIndex];
  tasks.splice(taskIndex, 1);
  writeTasksFile(tasks);

  console.log(`[dbHandler] Deleted task: ${id}`);
  return deletedTask;
}

ensureTasksFile();

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};