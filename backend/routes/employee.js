const express = require("express");
const router = express.Router();
const Employee = require("../models/employee");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// POST create employee
// POST create employee
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      JobTitle,
      Details,
      Status,
      List,
      DateReceived,
      DatetoClose,
      dateJoined,
      Manage,
    } = req.body;

    const image = req.file ? req.file.filename : undefined;

    const employee = new Employee({
      JobTitle,
      Details,
      Status,
      List,
      DateReceived,
      DatetoClose,
      Manage,
      dateJoined: dateJoined || Date.now(),
    });

    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all employees
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE employee
router.delete("/:id", async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (emp && emp.image) {
      const filePath = path.resolve("uploads", emp.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
