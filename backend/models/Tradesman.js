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
});

module.exports = mongoose.model("Tradesman", tradesmanSchema);
