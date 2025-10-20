import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// ✅ ใช้ secret เดียวกันกับ auth.js
const JWT_SECRET = "your_jwt_secret";

// Middleware ตรวจสอบ JWT
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log("✅ Authenticated user:", req.user.id);
    next();
  } catch (err) {
    console.error("❌ Token error:", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

// ✅ เพิ่ม Todo
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("📥 POST /api/todos");
    const { name, startDate, targetDate, status = "pending" } = req.body;

    if (!name || !startDate || !targetDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [result] = await req.db.query(
      "INSERT INTO todos (user_id, name, start_date, target_date, status) VALUES (?, ?, ?, ?, ?)",
      [req.user.id, name, startDate, targetDate, status]
    );

    console.log("✅ Todo created, ID:", result.insertId);
    res.status(201).json({
      message: "Todo created successfully",
      todoId: result.insertId,
    });
  } catch (error) {
    console.error("❌ Create error:", error);
    res.status(500).json({ message: "Failed to create todo" });
  }
});

// ✅ ดึง Todo ของ user
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("📥 GET /api/todos for user:", req.user.id);
    const [todos] = await req.db.query(
      "SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    console.log(`✅ Found ${todos.length} todos`);
    res.json(todos);
  } catch (error) {
    console.error("❌ Fetch error:", error);
    res.status(500).json({ message: "Failed to fetch todos" });
  }
});

// ✏️ Update Todo (ชื่อหรือวันที่)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    console.log(`📥 PUT /api/todos/${req.params.id}`);
    const { name, target_date } = req.body;
    const todoId = req.params.id;

    const [result] = await req.db.query(
      "UPDATE todos SET name = COALESCE(?, name), target_date = COALESCE(?, target_date) WHERE id = ? AND user_id = ?",
      [name, target_date, todoId, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    console.log("✅ Todo updated");
    res.json({ message: "Todo updated" });
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ message: "Failed to update todo" });
  }
});

// 🗑️ Delete Todo
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    console.log(`📥 DELETE /api/todos/${req.params.id}`);
    const todoId = req.params.id;

    const [result] = await req.db.query(
      "DELETE FROM todos WHERE id = ? AND user_id = ?",
      [todoId, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    console.log("✅ Todo deleted");
    res.json({ message: "Todo deleted" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ message: "Failed to delete todo" });
  }
});

// ✅ เปลี่ยนสถานะ (ติ๊กถูก / ไม่ถูก)
router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    console.log(`📥 PATCH /api/todos/${req.params.id}/status`);
    const { status } = req.body;
    const todoId = req.params.id;

    if (!status || !["pending", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const [result] = await req.db.query(
      "UPDATE todos SET status = ? WHERE id = ? AND user_id = ?",
      [status, todoId, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    console.log("✅ Status updated to:", status);
    res.json({ message: "Status updated" });
  } catch (err) {
    console.error("❌ Status update error:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
});

export default router;