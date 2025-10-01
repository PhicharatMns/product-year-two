
// const express = require("express");
// const myRouter = require("./routes/employee");
// const cors = require("cors");
// const path = require("path");
// const app = express();

// app.use(cors()); // อนุญาต request จากทุก origin
// app.use(express.json()); // รองรับ application/json
// app.use(express.urlencoded({ extended: true })); // รองรับ form-urlencoded

// app.use("/api/employees", myRouter);
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.listen(5000, "localhost", () => {
//   console.log("http://localhost:5000");
// });


const express = require('express')
const my_app = require('./routes/employee')
const app = express()
const cors = require('cors')
const path = require('path');

app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static('public'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/employees', my_app)

app.listen(5000, 'localhost', () => {
  console.log('start : http://localhost:50000')
})