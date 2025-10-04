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
      Worksheet,
      Employer,
      Contact_number,
      address,
      responsible,
      Date_of_acceptance_of_work,
      Closing_date,
      description,
    } = req.body;

    const image = req.file ? req.file.filename : undefined;

    const employee = new Employee({
      Worksheet,
      Employer,
      Contact_number,
      address,
      responsible,
      Date_of_acceptance_of_work: Date_of_acceptance_of_work || Date.now(),
      Closing_date: Closing_date || Date.now(),
      description,
      image,
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
