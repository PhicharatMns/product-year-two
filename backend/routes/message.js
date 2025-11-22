// routes/message.js
const express = require("express");
const Message = require("../models/message"); // โมเดลแบบ default export ก็ใช้ require ได้เลย

const router = express.Router();

router.post("/send", async (req, res) => {
  try {
    const { Name, message, ID, role } = req.body;

    if (!Name || !message) {
      return res.status(400).json({ error: "กรอกข้อมูลไม่ครบ" });
    }

    const newMsg = new Message({
      Name,
      message,
      role,
      ID,
    });

    await newMsg.save();
    res.json({ status: "success", data: newMsg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
