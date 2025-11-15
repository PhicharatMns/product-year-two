const mongoose = require("mongoose");

const iteme = new mongoose.Schema({
  name: String,
  category: String,
  number: String,
  counting: String,
});

const Item = mongoose.model("Item", iteme);

module.exports = Item;
