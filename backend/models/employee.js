
const mongoose = require("mongoose");
const urlDB = "mongodb://localhost:27017/Project_Y_TWO";

mongoose
  .connect(urlDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => console.error(err));

const employeeSchema = new mongoose.Schema({
  Worksheet: String,
  Employer: String,
  Contact_number: String,
  address: String,
  responsible: String,
  Date_of_acceptance_of_work: Date,
  Closing_date: Date,
  description: String,
  image: String
});


const Employee = mongoose.model("Employees", employeeSchema);

module.exports = Employee;




