import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";
import authRoutes from "./api/auth.js";
import todoRoutes from "./api/todo.js";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// สร้าง connection pool
const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "todolist_app"
});

// ✅ ทดสอบ DB connection
try {
  const [rows] = await db.query("SELECT 1");
  console.log("✅ Database connected successfully");
} catch (error) {
  console.error("❌ Database connection failed:", error.message);
  process.exit(1);
}

// middleware inject db
app.use((req, res, next) => {
  req.db = db;
  next();
});

// ✅ เพิ่ม logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  console.log("Headers:", req.headers.authorization ? "Token present" : "No token");
  console.log("Body:", req.body);
  next();
});

// ใช้ route แยก
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Global error:", err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});