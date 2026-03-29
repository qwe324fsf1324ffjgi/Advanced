// app/frontend/src/ui.js
function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(value) {
  if (!value) {
    return "No due date";
  }

  return value;
}

export function renderTaskList(container, tasks, handlers = {}) {
  if (!container) {
    return;
  }

  if (!Array.isArray(tasks) || tasks.length === 0) {
    container.innerHTML = `<div class="empty-state">No tasks found. Create a task to get started.</div>`;
    return;
  }

  container.innerHTML = tasks
    .map((task) => {
      const safeTitle = escapeHtml(task.title);
      const safeDescription = escapeHtml(task.description || "");

      return `
        <article class="task-card">
          <div class="task-card-header">
            <div>
              <h3>${safeTitle}</h3>
              <div class="task-meta">
                <span class="badge ${escapeHtml(task.priority)}">${escapeHtml(task.priority)}</span>
                <span class="badge ${escapeHtml(task.status)}">${escapeHtml(task.status)}</span>
              </div>
            </div>
          </div>

          <p class="task-description">${safeDescription || "No description provided."}</p>

          <div class="task-footer">
            <div class="task-dates">
              <div>Due: ${escapeHtml(formatDate(task.dueDate))}</div>
              <div>Updated: ${escapeHtml(task.updatedAt || "")}</div>
            </div>

            <div class="task-actions">
              <button type="button" data-action="toggle-status" data-id="${escapeHtml(task.id)}">
                ${task.status === "completed" ? "Mark Pending" : "Mark Completed"}
              </button>
              <button type="button" class="button-secondary" data-action="delete-task" data-id="${escapeHtml(task.id)}">
                Delete
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  container.querySelectorAll('[data-action="toggle-status"]').forEach((button) => {
    button.addEventListener("click", () => {
      if (typeof handlers.onToggleStatus === "function") {
        handlers.onToggleStatus(button.dataset.id);
      }
    });
  });

  container.querySelectorAll('[data-action="delete-task"]').forEach((button) => {
    button.addEventListener("click", () => {
      if (typeof handlers.onDeleteTask === "function") {
        handlers.onDeleteTask(button.dataset.id);
      }
    });
  });
}

export function renderMessages(container, message, type = "info") {
  if (!container) {
    return;
  }

  if (!message) {
    container.innerHTML = "";
    return;
  }

  const className =
    type === "error"
      ? "message-error"
      : type === "success"
      ? "message-success"
      : "message-info";

  container.innerHTML = `<p class="${className}">${escapeHtml(message)}</p>`;
}

export function renderAnalytics(container, analytics) {
  if (!container) {
    return;
  }

  container.innerHTML = `
    <div class="summary-card">
      <h3>Total Tasks</h3>
      <p>${analytics.totalTasks}</p>
    </div>
    <div class="summary-card">
      <h3>Completed Today</h3>
      <p>${analytics.completedToday}</p>
    </div>
    <div class="summary-card">
      <h3>Overdue</h3>
      <p>${analytics.overdue}</p>
    </div>
    <div class="summary-card">
      <h3>Status Mix</h3>
      <p>${analytics.completed}/${analytics.inProgress}/${analytics.pending}</p>
    </div>
  `;
}

export function renderAIInsights(container, recommendation) {
  if (!container) {
    return;
  }

  container.innerHTML = `<p>${escapeHtml(recommendation)}</p>`;
}

export function renderStorageMode(container, storageMode) {
  if (!container) {
    return;
  }

  container.innerHTML = `<p>Current backend storage mode: <strong>${escapeHtml(storageMode || "unknown")}</strong></p>`;
}