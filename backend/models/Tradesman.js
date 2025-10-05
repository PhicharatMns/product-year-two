const mongoose = require("mongoose");
const urlDB = "mogodb://localhost:27017/Project_Y_TWO";

mongoose
  .connect(urlDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => console.error(err));

const tradesmanSchema = new mongoose.Schema({
  Name: String,
  Nickname: String,
  ID: String,
  Birthday: String,
  Address: String,
  Phone_Number: String,
  Email: String,
  Profile: String,
  Position: String,
  Start_data: Date,
});

const Tradesman = mongoose.model("Tradesman", tradesmanSchema);

module.exports = Tradesman;
