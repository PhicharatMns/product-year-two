const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const tradesmanRouter = require("./routes/tradesman");
const employeeRouter = require("./routes/employee");
const otherTradesmanRouter = require("./routes/otherTradesman");
const loginRouter = require("./routes/login");
const item = require("./routes/iteme");
const additem = require("./routes/additem");
const app = express();

// ใช้ CORS ให้รองรับ cookie
app.use(
  cors({
    origin: "http://localhost:5173", // URL frontend
    credentials: true, // ต้องใส่เพื่อให้ cookie ส่งไปได้
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());

mongoose
  .connect("mongodb://127.0.0.1:27017/Project_Y_TWO")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/tradesman", tradesmanRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/otherTradesman", otherTradesmanRouter);
app.use("/api/login", loginRouter);
app.use("/api/item", item);
app.use("/api/additem", additem);

app.listen(5000, "localhost", () => {
  console.log("Server running at http://localhost:5000");
});
