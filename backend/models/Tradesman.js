const mongoose = require("mongoose");

const tradesmanSchema = new mongoose.Schema({
  Name: String,
  Nickname: String,
  ID: String,
  Birthday: String,
  Address: String,
  Phone_Number: String,
  Email: String,
  Profile: String,
  Position: String,
  Start_data: String,
  User: String,
  Pass: String,
  role: { type: String, enum: ["admin", "user"], default: "user" },
});

module.exports = mongoose.model("Tradesman", tradesmanSchema);
