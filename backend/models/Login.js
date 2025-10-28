const mongoose = require("mongoose");

const login = new mongoose.Schema({
  username: String,
  passwork: String,
  Name: String,
  Nickname: String,
  ID: String,
  Birthday: String,
  Address: String,
  Phone_Number: String,
  Email: String,
  Profile: String,
  Position: String,
  Start_data: String,
  role: {
    type: String,
    enum: ["user", "admin", "chief", "executive"],
    default: "user",
  },

});

const Login = mongoose.model("Login", login);

module.exports = Login;
