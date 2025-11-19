// routes/additem.js
const express = require("express");
const router = express.Router();
const Additem = require("../models/additem");
const Login = require("../models/Login");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

// Middleware ตรวจสอบ token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ message: "Token required" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded; // id, username, role
    next();
  });
};

// GET: ดึงรายการทั้งหมดของงาน
router.get("/", async (req, res) => {
  const { jobId } = req.query;

  try {
    let items;
    if (jobId) {
      items = await Additem.find({ jobId });
    } else {
      items = await Additem.find(); // ดึงทั้งหมด
    }

    const formattedItems = items.map((item) => ({
      id: item._id,
      name: item.name,
      quantity: item.quantity,
      jobId: item.jobId,
      description: item.description || "ไม่ระบุ",
      requesterName: item.requesterName || "ไม่ทราบ",
      requesterProfile: item.requesterProfile || "/default-profile.png",
      section: item.section || "ไม่ระบุ",
      role: item.role || "ไม่ระบุ",
      createdAt: item.createdAt || new Date(),
      status: item.status || "รอดำเนินการ",
      reasondescriptionstatus: item.reasondescriptionstatus || "",
      statusUpdatedAt: item.statusUpdatedAt || null,
      additemecomfam: item.additemecomfam,
    }));

    res.json(formattedItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// POST: เพิ่มรายการ (ดึง requester จาก token)
router.post("/", verifyToken, async (req, res) => {
  const {
    name,
    quantity,
    jobId,
    description,
    section,
    role,
    additemecomfam,
    status,
  } = req.body;

  if (!jobId) return res.status(400).json({ message: "jobId required" });

  try {
    const user = await Login.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newItem = new Additem({
      name,
      quantity,
      jobId,
      description,
      requesterName: user.Name,
      requesterProfile: user.Profile || "/default-profile.png",
      section,
      role,
      createdAt: new Date(),
      status,
      additemecomfam,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
});

// DELETE: ลบรายการ
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Additem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// PUT: อัปเดตสถานะของรายการ
router.put("/:id/status", verifyToken, async (req, res) => {
  const { status, reasondescriptionstatus } = req.body;

  if (!status) {
    return res.status(400).json({ message: "status required" });
  }

  try {
    const updatedItem = await Additem.findByIdAndUpdate(
      req.params.id,
      {
        status: status,
        reasondescriptionstatus: reasondescriptionstatus || "",
        statusUpdatedAt: new Date(), //  เซ็ตเวลาปัจจุบัน
      },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({
      message: "Status updated successfully",
      item: updatedItem,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// PUT: ยืนยันรายการ -> บันทึกข้อความไป additemecomfam
router.put("/:id/confirm", verifyToken, async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: "message required" });
  }

  try {
    const updatedItem = await Additem.findByIdAndUpdate(
      req.params.id,
      {
        additemecomfam: message, // บันทึกข้อความยืนยัน
        status: "ได้รับการยืนยันจากคลังแล้ว", // อัปเดต status พร้อมกัน
      },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({
      message: "Confirm message saved successfully",
      item: updatedItem,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
