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
    const {
      Name,
      Position,
      Phone_Number,
      Profile,
      employeeId,
      id,
      role,
      NameJOB,
      Work_day,
      Closing_day,
    } = req.body;

    // หาว่าช่างคนนี้เคยอยู่ในงานนี้มาก่อนหรือยัง
    const existing = await OtherTradesman.findOne({ id, employeeId });

    if (existing) {
      // ถ้ามีอยู่แล้ว ให้เพิ่มค่า Jobs
      existing.Jobs += 1;
      await existing.save();
      return res.json(existing);
    }

    // ถ้ายังไม่มี ให้สร้างใหม่ (เพิ่มช่างเข้าใบงานนี้)
    const newTradesman = new OtherTradesman({
      Name,
      Position,
      Phone_Number,
      Profile,
      employeeId,
      id,
      Jobs: 1,
      role: role || "worker", // default
      NameJOB: NameJOB || "ไม่ระบุชื่องาน", // <-- ต้องใส่ตรงนี้
      Work_day,
      Closing_day,
    });

    const saved = await newTradesman.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
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
        NameJOB: owner.NameJOB,
        
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดของเซิร์ฟเวอร์" });
  }
});

// routes/otherTradesman.js
router.get("/count/all", async (req, res) => {
  try {
    const result = await OtherTradesman.aggregate([
      {
        $group: {
          _id: "$id", // แยกตามงาน
          NameJOB: { $first: "$NameJOB" }, // ดึงชื่องาน
          Work_day: { $first: "$Work_day" }, // ดึงวันเริ่มงาน
          Closing_day: { $first: "$Closing_day" }, // ดึงวันปิดงาน
          count: { $sum: "$Jobs" }, // รวม Jobs
        },
      },
      { $sort: { count: -1 } },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
