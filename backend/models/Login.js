// models/Login.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const loginSchema = new mongoose.Schema({
  user: { type: String, required: true, unique: true },
  pass: { type: String, required: true }
});

loginSchema.pre("save", async function (next) {
  if (!this.isModified("pass")) return next();
  this.pass = await bcrypt.hash(this.pass, 10);
  next();
});

loginSchema.methods.matchPassword = async function (enteredPass) {
  return await bcrypt.compare(enteredPass, this.pass);
};

module.exports = mongoose.model("Login", loginSchema);
