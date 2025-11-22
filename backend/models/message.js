const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Nickname: { type: String },
  ID: { type: String, default: "none" },
  Profile: { type: String },
  role: {
    type: String,
    enum: ["user", "admin", "chief", "executive"],
    default: "user",
  },
  Position: { type: String },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
