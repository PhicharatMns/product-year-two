
const mongoose = require("mongoose");
const urlDB = "mongodb://localhost:27017/Project_Y_TWO";

mongoose
  .connect(urlDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => console.error(err));

const employeeSchema = new mongoose.Schema({
  JobTitle: String,  // ชื่อ
  Details: String,   // นามสกุล
  Status: String,
  List: String,
  DateReceived: String,
  DatetoClose: String,
  dateJoined: Date,
  Manage: String,
});


const Employee = mongoose.model("Employees", employeeSchema);

module.exports = Employee;