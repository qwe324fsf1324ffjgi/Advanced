// app/frontend/src/analytics.js
export function tasksCompletedToday(tasks) {
  const today = new Date().toISOString().slice(0, 10);

  return tasks.filter((task) => {
    if (task.status !== "completed" || !task.updatedAt) {
      return false;
    }

    return String(task.updatedAt).slice(0, 10) === today;
  }).length;
}

export function overdueCount(tasks) {
  const today = new Date().toISOString().slice(0, 10);

  return tasks.filter((task) => {
    if (!task.dueDate) {
      return false;
    }

    return task.status !== "completed" && task.dueDate < today;
  }).length;
}

export function statusSummary(tasks) {
  return tasks.reduce(
    (summary, task) => {
      if (task.status === "completed") {
        summary.completed += 1;
      } else if (task.status === "in-progress") {
        summary.inProgress += 1;
      } else {
        summary.pending += 1;
      }

      return summary;
    },
    {
      pending: 0,
      inProgress: 0,
      completed: 0
    }
  );
}

export function recommendedNextAction(tasks) {
  const overdueTasks = tasks.filter(
    (task) => task.dueDate && task.status !== "completed" && task.dueDate < new Date().toISOString().slice(0, 10)
  );

  if (overdueTasks.length > 0) {
    return `You have ${overdueTasks.length} overdue task(s). Start with the highest-priority overdue task first.`;
  }

  const highPriorityPending = tasks.find(
    (task) => task.priority === "high" && task.status !== "completed"
  );

  if (highPriorityPending) {
    return `Focus on "${highPriorityPending.title}" next because it is marked high priority.`;
  }

  const inProgressTask = tasks.find((task) => task.status === "in-progress");

  if (inProgressTask) {
    return `Try to finish "${inProgressTask.title}" before starting a new task.`;
  }

  if (tasks.length === 0) {
    return "Create your first task to start building momentum.";
  }

  return "Your task list looks healthy. Keep moving completed work forward.";
}