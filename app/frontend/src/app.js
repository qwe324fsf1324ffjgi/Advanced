// app/frontend/src/app.js
import {
  tasksCompletedToday,
  overdueCount,
  statusSummary,
  recommendedNextAction
} from "./analytics.js";
import {
  renderTaskList,
  renderMessages,
  renderAnalytics,
  renderAIInsights,
  renderStorageMode
} from "./ui.js";

const taskForm = document.getElementById("task-form");
const resetButton = document.getElementById("reset-button");
const taskListElement = document.getElementById("task-list");
const messageArea = document.getElementById("message-area");
const analyticsSummary = document.getElementById("analytics-summary");
const aiInsights = document.getElementById("ai-insights");
const storageModeElement = document.getElementById("storage-mode");
const taskCountElement = document.getElementById("task-count");

const searchFilter = document.getElementById("search-filter");
const statusFilter = document.getElementById("status-filter");
const priorityFilter = document.getElementById("priority-filter");

let allTasks = [];

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

function getFilteredTasks(tasks) {
  const searchValue = searchFilter.value.trim().toLowerCase();
  const selectedStatus = statusFilter.value;
  const selectedPriority = priorityFilter.value;

  return tasks.filter((task) => {
    const matchesSearch =
      !searchValue ||
      task.title.toLowerCase().includes(searchValue) ||
      (task.description || "").toLowerCase().includes(searchValue);

    const matchesStatus =
      selectedStatus === "all" || task.status === selectedStatus;

    const matchesPriority =
      selectedPriority === "all" || task.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });
}

function updateDashboard() {
  const filteredTasks = getFilteredTasks(allTasks);
  const summary = statusSummary(allTasks);

  renderTaskList(taskListElement, filteredTasks, {
    onToggleStatus: handleToggleStatus,
    onDeleteTask: handleDeleteTask
  });

  renderAnalytics(analyticsSummary, {
    totalTasks: allTasks.length,
    completedToday: tasksCompletedToday(allTasks),
    overdue: overdueCount(allTasks),
    pending: summary.pending,
    inProgress: summary.inProgress,
    completed: summary.completed
  });

  renderAIInsights(aiInsights, recommendedNextAction(allTasks));

  taskCountElement.textContent = `${filteredTasks.length} task(s) shown`;
}

async function loadTasks() {
  try {
    const response = await request("/api/tasks");
    allTasks = Array.isArray(response.data) ? response.data : [];
    updateDashboard();
  } catch (error) {
    renderMessages(messageArea, error.message, "error");
  }
}

async function loadStorageMode() {
  try {
    const response = await request("/api/storage-mode");
    renderStorageMode(storageModeElement, response.storageMode);
  } catch (error) {
    renderStorageMode(storageModeElement, "unknown");
  }
}

function resetForm() {
  taskForm.reset();
  document.getElementById("priority").value = "medium";
  document.getElementById("status").value = "pending";
}

async function handleCreateTask(event) {
  event.preventDefault();

  const formData = new FormData(taskForm);
  const payload = {
    title: String(formData.get("title") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    priority: String(formData.get("priority") || "medium"),
    status: String(formData.get("status") || "pending"),
    dueDate: String(formData.get("dueDate") || "")
  };

  try {
    await request("/api/tasks", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    renderMessages(messageArea, "Task created successfully.", "success");
    resetForm();
    await loadTasks();
  } catch (error) {
    renderMessages(messageArea, error.message, "error");
  }
}

async function handleToggleStatus(taskId) {
  const task = allTasks.find((item) => item.id === taskId);

  if (!task) {
    renderMessages(messageArea, "Task not found.", "error");
    return;
  }

  const nextStatus = task.status === "completed" ? "pending" : "completed";

  try {
    await request(`/api/tasks/${taskId}`, {
      method: "PUT",
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: nextStatus,
        dueDate: task.dueDate
      })
    });

    renderMessages(messageArea, "Task updated successfully.", "success");
    await loadTasks();
  } catch (error) {
    renderMessages(messageArea, error.message, "error");
  }
}

async function handleDeleteTask(taskId) {
  try {
    await request(`/api/tasks/${taskId}`, {
      method: "DELETE"
    });

    renderMessages(messageArea, "Task deleted successfully.", "success");
    await loadTasks();
  } catch (error) {
    renderMessages(messageArea, error.message, "error");
  }
}

function handleFiltersChange() {
  updateDashboard();
}

taskForm.addEventListener("submit", handleCreateTask);
resetButton.addEventListener("click", () => {
  resetForm();
  renderMessages(messageArea, "Form cleared.", "info");
});

searchFilter.addEventListener("input", handleFiltersChange);
statusFilter.addEventListener("change", handleFiltersChange);
priorityFilter.addEventListener("change", handleFiltersChange);

loadTasks();
loadStorageMode();