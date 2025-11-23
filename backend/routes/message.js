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
    req.user = decoded; // decoded จะมี { Name, id, role }
    next();
  });
};

// ------------------------------------------------
//  ส่งข้อความ  (รองรับ problem ด้วย)
// ------------------------------------------------
router.post("/send", verifyToken, async (req, res) => {
  try {
    const { Name, message, ID, role, problem } = req.body;

    if (!Name || !message) {
      return res.status(400).json({ error: "กรอกข้อมูลไม่ครบ" });
    }

    // ชื่อคนส่งจาก token
    const senderName = req.user.Name || "unknown";

    const newMsg = new Message({
      Name, // ชื่อผู้รับ
      message,
      role,
      ID,
      requireNameinMessage: senderName, // ชื่อผู้ส่งจาก token
      problem: problem || "", // ใช้ค่า problem จาก frontend
    });

    await newMsg.save();
    res.json({ status: "success", data: newMsg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

//  ดึงข้อความทั้งหมดของ user ที่ล็อกอิน
router.get("/all", verifyToken, async (req, res) => {
  try {
    const myName = req.user.Name;

    const messages = await Message.find({
      $or: [
        { requireNameinMessage: myName }, // เราเป็นคนส่ง
        { Name: myName }, // เราเป็นคนรับ
      ],
    }).sort({ timestamp: -1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// routes/message.js
router.patch("/update-problem/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { problem } = req.body;

  if (!problem)
    return res
      .status(400)
      .json({ success: false, error: "กรุณาส่งค่า problem" });

  try {
    const updated = await Message.findByIdAndUpdate(
      id,
      { problem },
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
