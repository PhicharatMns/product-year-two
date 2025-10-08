const mongoose = require("mongoose");

const tradesmanSchema = new mongoose.Schema({
  Worksheet: String,
  Employer: String,
  Contact_number: String,
  address: String,
  responsible: String,
  Date_of_acceptance_of_work: String,
  Closing_date: String,
  description: String,
  image: String,
  tradesmen: [{ type: mongoose.Schema.Types.ObjectId, ref: "TradesmanProfile" }] // เพิ่มตรงนี้
});

module.exports = mongoose.model("Tradesman", tradesmanSchema);
