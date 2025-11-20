const mongoose = require("mongoose");

const countingSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  timestamp: { type: Date, required: true },
});

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    number: { type: String, required: true },
    counting: { type: countingSchema, required: true }, // เปลี่ยนจาก String เป็น object
  },
  { timestamps: true }
); // เพิ่ม createdAt และ updatedAt อัตโนมัติ

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
