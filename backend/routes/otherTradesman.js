const express = require("express");
const router = express.Router();
const OtherTradesman = require("../models/OtherTradesman");

// GET - ดึงข้อมูลทั้งหมด
router.get("/", async (req, res) => {
  try {
    const data = await OtherTradesman.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - เพิ่มช่าง
router.post("/", async (req, res) => {
  try {
    const newTradesman = new OtherTradesman(req.body);
    const saved = await newTradesman.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/", async (req, res) => {
  try {
    const { Name, Position, Phone_Number, Profile, employeeId } = req.body;
    const newTradesman = new OtherTradesman({
      Name,
      Position,
      Phone_Number,
      Profile,
      employeeId
    });
    const saved = await newTradesman.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;
    const list = await OtherTradesman.find({ employeeId });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - ลบช่างจาก otherTradesman ตาม _id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params; 
    const deleted = await OtherTradesman.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "ไม่พบช่างที่จะลบ" });
    }

    res.json({ message: "ลบช่างสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: "ลบไม่สำเร็จ", error: err.message });
  }
});



module.exports = router;
