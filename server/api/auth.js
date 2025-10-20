import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();


const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";


router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    
    const [existing] = await req.db.query(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [email, username]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await req.db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );
    console.log("✅ User registered:", { id: result.insertId, username, email });
    res.status(201).json({
      message: "User registered successfully",
      user: { id: result.insertId, username, email },
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

// ✅ Login
router.post("/login", async (req, res) => {
  try {
    console.log("📥 Login request:", req.body);
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // หา user ในฐานข้อมูล
    const [users] = await req.db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (users.length === 0) {
      console.log("❌ User not found:", username);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    // ตรวจสอบ password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      console.log("❌ Invalid password for user:", username);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ สร้าง JWT token (ใช้ secret เดียวกับ verify)
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET, // ✅ ใช้ตัวแปรเดียวกัน
      { expiresIn: "7d" }
    );

    console.log("✅ Login successful:", { username, token: token.substring(0, 20) + "..." });
    console.log("🔑 Using JWT_SECRET:", JWT_SECRET); // Debug

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

export default router;