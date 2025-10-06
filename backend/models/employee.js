
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  Worksheet: String,
  Employer: String,
  Contact_number: String,
  address: String,
  responsible: String,
  Date_of_acceptance_of_work: Date,
  Closing_date: Date,
  description: String,
  image: String,
  Status: String
});


module.exports = mongoose.model('employee', employeeSchema)



