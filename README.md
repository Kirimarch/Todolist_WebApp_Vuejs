# ✨ My Todos — แอปจัดการงานส่วนตัว (Vue 3 + Node.js + MySQL)

## 📌 คำอธิบายโปรเจกต์ (Project Overview)
**My Todos** เป็นแอปสำหรับจัดการงานส่วนตัวที่ออกแบบให้ใช้งานง่ายและมีอินเทอร์เฟซที่สวยงาม  
รองรับระบบล็อกอินด้วย JWT Token พร้อมเชื่อมต่อฐานข้อมูล **MySQL**  
สามารถเพิ่ม แก้ไข ลบ และติ๊กงานที่เสร็จแล้วได้ รวมถึงมีฟีเจอร์กรอง (Filter) และเรียงลำดับงานอัตโนมัติตามสถานะและวันครบกำหนด

---

## 🚀 ฟีเจอร์หลัก (Key Features)
- 🔐 ระบบล็อกอินด้วย **JWT Authentication**
- 🧾 เพิ่ม / แก้ไข / ลบงาน (CRUD)
- ✅ เปลี่ยนสถานะงาน (Pending ↔ Completed)
- 📅 เลือกวันเป้าหมายด้วยปุ่ม **Pick Date**
- 📊 สรุปจำนวนงานทั้งหมด / ที่เหลือ / ที่เสร็จแล้ว
- 🔍 กรองงานด้วย Filter (All / Pending / Completed)
- 📈 เรียงลำดับอัตโนมัติ:
  - Pending ก่อน Completed  
  - Target date ใกล้ปัจจุบันขึ้นก่อน  
  - ถ้าวันเท่ากันจะเรียงตามเวลาสร้าง
- ⚠️ แสดงสถานะ **Overdue** สำหรับงานที่เกินวันเป้าหมาย
- 🎨 ดีไซน์ธีมมืด (Dark UI) พร้อม Scrollbar เข้าธีม
- 📱 รองรับการแสดงผลแบบ Responsive

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)
**Frontend:**  
- Vue 3 + Composition API  
- Tailwind CSS  
- Axios  

**Backend:**  
- Node.js + Express.js  
- MySQL
- JWT Authentication  

**Tools:**  
- XAMPP (optional for local setup)  
- Vite  

## ⚙️ วิธีติดตั้งและใช้งาน (Installation)
### 1. ติดตั้ง Backend
```bash
cd backend
npm install
node server.js
เซิร์ฟเวอร์จะรันที่:
>> http://localhost:5000
## 2. ติดตั้ง Frontend
cd frontend
npm install
npm run dev
เปิดในเบราว์เซอร์ที่:
>> http://localhost:5173
3.การตั้งค่าฐานข้อมูล (MySQL)
สร้างฐานข้อมูลชื่อ todolist_app และรัน SQL นี้:
CREATE TABLE todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  target_date DATE NOT NULL,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'completed') DEFAULT 'pending'
);
CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);
Disclaimer
💬 พัฒนาเพื่อใช้ใน Portfolio และเรียนรู้ Vue.js / Node.js / MySQL

English Vesion

✨ My Todos — Personal Task Manager (Vue 3 + Node.js + MySQL)
📌 Overview

My Todos is a modern, responsive task management web app built with Vue 3 and Node.js.
It helps you organize daily tasks efficiently with authentication, filtering, sorting, and a clean dark interface.
All data is securely stored in MySQL, and users can manage their own tasks independently via JWT-based login.

🚀 Features

🔐 JWT Authentication for secure login

🧾 Full CRUD (Add / Edit / Delete)

✅ Toggle task status (Pending ↔ Completed)

📅 Select target date with a stylish Pick Date button

📊 Summary bar showing total / pending / completed tasks

🔍 Filter by task status (All / Pending / Completed)

📈 Auto-sorting by:

Pending above Completed

Closer target date comes first

If same date → order by creation time

⚠️ Highlight overdue tasks

🎨 Dark theme with custom scrollbar

📱 Fully responsive layout

🛠️ Tech Stack

Frontend: Vue 3, TailwindCSS, Axios
Backend: Node.js (Express), MySQL, JWT
Tools: Vite, Docker (optional)

⚙️ Installation
Backend
cd backend
npm install
node server.js


Server runs at:
👉 http://localhost:5000

Frontend
cd frontend
npm install
npm run dev


Then visit:
👉 http://localhost:5173

💾 Database Setup
Creat data base todolist_app Run this SQL:

CREATE TABLE todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  target_date DATE NOT NULL,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'completed') DEFAULT 'pending'
);
CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);
Disclaimer
💬 Built as a learning project and portfolio showcase.