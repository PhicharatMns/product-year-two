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
      Status,
      messageDelete,
      pepleCreteJob
    } = req.body;

    const image = req.file ? req.file.filename : undefined;

    let parsedAddress = { type: "Point", coordinates: [0, 0] };
    try {
      const addr = typeof address === "string" ? JSON.parse(address) : address;
      if (addr && addr.coordinates && addr.coordinates.length === 2) {
        parsedAddress = addr;
      }
    } catch (err) {
      console.error("Invalid address JSON:", err);
    }

    const employee = new Employee({
      Worksheet,
      Employer,
      Contact_number,
      address: parsedAddress,
      responsible,
      Date_of_acceptance_of_work: Date_of_acceptance_of_work || Date.now(),
      Closing_date: Closing_date || Date.now(),
      description,
      image,
      Status,
      messageDelete,
      pepleCreteJob
    });

    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    console.error("Error creating employee:", err);
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

// PUT update employee
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ error: "Employee not found" });

    const {
      Worksheet,
      Employer,
      Contact_number,
      address,
      area,
      responsible,
      Date_of_acceptance_of_work,
      Closing_date,
      description,
      Status,
      messageDelete, // <-- เพิ่ม
    } = req.body;

    // ถ้ามีไฟล์ใหม่ → ลบไฟล์เก่า
    if (req.file && emp.image) {
      const oldPath = path.resolve("uploads", emp.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      emp.image = req.file.filename;
    }

    // parse address
    let parsedAddress = emp.address;
    try {
      parsedAddress =
        typeof address === "string"
          ? JSON.parse(address)
          : address || emp.address;
    } catch {
      parsedAddress = emp.address;
    }

    // parse area
    let parsedArea = emp.area;
    try {
      parsedArea =
        typeof area === "string" ? JSON.parse(area) : area || emp.area;
    } catch {
      parsedArea = emp.area;
    }

    // อัพเดต fields
    emp.Worksheet = Worksheet ?? emp.Worksheet;
    emp.Employer = Employer ?? emp.Employer;
    emp.Contact_number = Contact_number ?? emp.Contact_number;
    emp.address = parsedAddress;
    emp.area = parsedArea;
    emp.responsible = responsible ?? emp.responsible;
    emp.Date_of_acceptance_of_work =
      Date_of_acceptance_of_work ?? emp.Date_of_acceptance_of_work;
    emp.Closing_date = Closing_date ?? emp.Closing_date;
    emp.description = description ?? emp.description;
    emp.Status = Status ?? emp.Status;
    emp.messageDelete = messageDelete ?? emp.messageDelete; // <-- แก้ตรงนี้

    await emp.save();
    res.json(emp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
