const mongoose = require("mongoose");

const otherTradesmanSchema = new mongoose.Schema({
  Name: String,
  Position: String,
  Phone_Number: String,
  Profile: String,
  employeeId: {
    type: String, // ผูกกับ _id ของ employee
    required: true,
  },
  id: String,
  Jobs: {
    type: Number,
    default: 0, // เริ่มจาก 0
  },
  role: String,
});

module.exports = mongoose.model("OtherTradesman", otherTradesmanSchema);
