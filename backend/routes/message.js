// routes/message.js
const express = require("express");
const Message = require("../models/message");
const router = express.Router();

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

// Middleware ตรวจสอบ token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded; // มี Name, id, role
    next();
  });
};

//  ส่งข้อความ (ต้องใช้ verifyToken)
router.post("/send", verifyToken, async (req, res) => {
  try {
    const { Name, message, ID, role } = req.body;

    if (!Name || !message) {
      return res.status(400).json({ error: "กรอกข้อมูลไม่ครบ" });
    }

    // 👉 ชื่อคนส่งจาก token
    const senderName = req.user.Name || "unknown";

    const newMsg = new Message({
      Name, // ชื่อผู้รับ
      message, // ตัวข้อความ
      role,
      ID, // ID ของผู้รับ
      requireNameinMessage: senderName, // ใช้ชื่อจาก token แบบ
    });

    await newMsg.save();
    res.json({ status: "success", data: newMsg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// ดึงข้อความทั้งหมด
// ดึงข้อความทั้งหมดของ "คนนี้" เท่านั้น
router.get("/all", verifyToken, async (req, res) => {
  try {
    // user ที่ล็อกอินอยู่
    const myName = req.user.Name;

    // ดึงเฉพาะข้อความที่:
    //  requireNameinMessage = ชื่อเรา → เราเป็นคนส่ง
    //  Name = ชื่อเรา → เราเป็นคนรับ
    const messages = await Message.find({
      $or: [
        { requireNameinMessage: myName }, // ฉันเป็นคนส่ง
        { Name: myName }, // ฉันเป็นคนรับ
      ],
    }).sort({ timestamp: -1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
