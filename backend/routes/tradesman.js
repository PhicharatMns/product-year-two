const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Tradesman = require("../models/Tradesman");
const fs = require("fs");

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../uploads/Tradesman");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// GET all tradesman
router.get("/", async (req, res) => {
  try {
    const tradesmen = await Tradesman.find();
    res.json(tradesmen);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลช่างได้" });
  }
});

// POST new tradesman
router.post("/", upload.single("Profile"), async (req, res) => {
  try {
    const {
      Name,
      Nickname,
      ID,
      Birthday,
      Address,
      Phone_Number,
      Email,
      Position,
      Start_data,
    } = req.body;
    const newTradesman = new Tradesman({
      Name,
      Nickname,
      ID,
      Birthday,
      Address,
      Phone_Number,
      Email,
      Position,
      Start_data,
      Profile: req.file ? req.file.filename : "",
    });
    await newTradesman.save();
    res.status(201).json(newTradesman);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เพิ่มช่างไม่สำเร็จ" });
  }
});

// DELETE tradesman by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Tradesman.findByIdAndDelete(req.params.id);
    if (deleted && deleted.Profile) {
      const filePath = path.join(__dirname, "..", deleted.Profile);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    res.json({ message: "ลบข้อมูลสำเร็จ" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "ลบไม่สำเร็จ" });
  }
});

module.exports = router;
