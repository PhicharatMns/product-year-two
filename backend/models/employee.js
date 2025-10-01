
const mongoose = require("mongoose");
const urlDB = "mongodb://localhost:27017/Project_Y_TWO";

mongoose
  .connect(urlDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => console.error(err));

const employeeSchema = new mongoose.Schema({
  firstName: String,  // ชื่อ
  lastName: String,   // นามสกุล
  email: String,
  phone: String,
  position: String,
  department: String,
  dateJoined: Date,
  status: String,
   image: String
});


const Employee = mongoose.model("Employees", employeeSchema);

module.exports = Employee;