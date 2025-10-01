const mongoose = require("mongoose");
const urlDB = "mongodb://localhost:27017/Project_Y_TWO";

mongoose
  .connect(urlDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => console.error(err));

const employeeSchame = mongoose.Schema({
  name: String,
  image: String,
  salary: Number,
});

const Employee = mongoose.model("Employees", employeeSchame);

module.exports = Employee;/