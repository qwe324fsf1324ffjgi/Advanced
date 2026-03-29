// app/backend/server.js
const express = require("express");
const cors = require("cors");
const logger = require("./middleware/logger");
const taskRoutes = require("./routes/tasks");

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const STORAGE_DRIVER = process.env.STORAGE_DRIVER || "json";

app.use(
  cors({
    origin: true,
    credentials: false
  })
);

app.use(express.json());
app.use(logger);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "todoapp backend is healthy"
  });
});

app.get("/api/storage-mode", (req, res) => {
  res.status(200).json({
    success: true,
    storageMode: STORAGE_DRIVER
  });
});

app.use("/api/tasks", taskRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.use((err, req, res, next) => {
  console.error("[server] Unhandled error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

app.listen(PORT, () => {
  console.log(`[server] todoapp backend running on port ${PORT}`);
});