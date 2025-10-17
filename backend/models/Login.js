const mongoose = require("mongoose");

const login = new mongoose.Schema({
  username: String,
  passwork: String,
});

const Login = mongoose.model("Login", login);

module.exports = Login;
