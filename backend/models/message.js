const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  Name: { type: String, required: true }, // ชื่อผู้รับ
  Nickname: { type: String },
  ID: { type: String, default: "none" }, // ID ผู้รับ
  Profile: { type: String },
  role: {
    type: String,
    enum: ["user", "admin", "chief", "executive"],
    default: "user",
  },
  Position: { type: String },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  requireNameinMessage: { type: String, required: true }, // ชื่อผู้ส่ง
  problem: { type: String, default: "" },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
