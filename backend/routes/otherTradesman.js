const express = require("express");
const router = express.Router();
const OtherTradesman = require("../models/OtherTradesman");
const Login = require("../models/Login");

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
    const { Name, Position, Phone_Number, Profile, employeeId, id } = req.body;
    const newTradesman = new OtherTradesman({
      Name,
      Position,
      Phone_Number,
      Profile,
      employeeId,
      id,
    });
    const saved = await newTradesman.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET - ดึงช่างตามงาน
router.get("/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;
    const list = await OtherTradesman.find({ employeeId });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE - ลบช่างตาม _id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await OtherTradesman.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "ไม่พบช่างที่จะลบ" });

    res.json({ message: "ลบช่างสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: "ลบไม่สำเร็จ", error: err.message });
  }
});

// ตรวจว่างานมีไหม และเป็นของใคร
router.get("/check/:id", async (req, res) => {
  try {
    const { id } = req.params; // id ของงาน
    const job = await Employee.findById(id);

    if (!job) {
      return res.status(404).json({ message: "ไม่พบน งานนี้ในระบบ" });
    }

    // ถ้ามีการเก็บว่าใครสร้างงาน (เช่นมี field ownerId)
    const owner = await Login.findById(job.ownerId);

    if (!owner) {
      return res.json({
        message: "พบน งาน แต่ไม่พบเจ้าของ",
        job,
      });
    }

    res.json({
      message: "พบน งานและเจ้าของ",
      job,
      owner: {
        _id: owner._id,
        Name: owner.Name,
        role: owner.role,
        Email: owner.Email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดของเซิร์ฟเวอร์" });
  }
});

module.exports = router;
