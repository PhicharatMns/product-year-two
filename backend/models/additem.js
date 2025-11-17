const mongoose = require("mongoose");

const additemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  jobId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }, // เก็บวันที่
  description: String,
  requesterName: String,
  requesterProfile: String,
});

const Additem = mongoose.model("Additem", additemSchema);

module.exports = Additem;
