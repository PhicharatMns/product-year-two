// const mongoose = require("mongoose");
// const urlDB = "mongodb://localhost:27017/Project_Y_TWO";

// mongoose
//   .connect(urlDB, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .catch((err) => console.error(err));

// const employeeSchame = mongoose.Schema({
//   name: String,
//   image: String,
//   salary: Number,
// });

// const Employee = mongoose.model("Employees", employeeSchame);

// module.exports = Employee;


const mongoose = require('mongoose');
const urlDB = 'mongodb://localhost:27017/Employees';

mongoose.connect(urlDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch(err => console.error(err));


// Employees Schema
const EmployeesSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String },
  email: { type: String, unique: true },
  phone: { type: String },
  position: { type: String },
  department: { type: String },
  hireDate: { type: Date },
  salary: { type: Number, required: true },
  profileImage: { type: String },
}, { timestamps: true });

const Employees = mongoose.model('Employees', EmployeesSchema);

module.exports = Employees;
