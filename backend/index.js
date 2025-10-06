const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const tradesmanRouter = require("./routes/tradesman");
const employeeRouter = require("./routes/employee");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/Project_Y_TWO")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(" MongoDB connection error:", err));

// Routes
app.use("/api/tradesman", tradesmanRouter);
app.use("/api/employees", employeeRouter);

// Start server
app.listen(5000, "localhost", () => {
  console.log("Server running at http://localhost:5000");
});
