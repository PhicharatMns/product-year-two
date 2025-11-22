// routes/message.js
const express = require("express");
const Message = require("../models/message"); // โมเดลแบบ default export ก็ใช้ require ได้เลย
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
    req.user = decoded; // จะมี id, username, role, Name
    next();
  });
};

router.post("/send", async (req, res) => {
  try {
    const { Name, message, ID, role, senderName } = req.body;

    if (!Name || !message) {
      return res.status(400).json({ error: "กรอกข้อมูลไม่ครบ" });
    }

    const newMsg = new Message({
      Name,
      message,
      role,
      ID,
      requireNameinMessage: senderName || "unknown", // ต้องมีค่า
    });

    await newMsg.save();
    res.json({ status: "success", data: newMsg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// ดึงข้อความทั้งหมด
router.get("/all", async (req, res) => {
  try {
    const allMessages = await Message.find().sort({ timestamp: -1 }); // เรียงล่าสุดก่อน
    res.json(allMessages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
