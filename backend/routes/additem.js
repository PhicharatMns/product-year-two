// routes/additem.js
const express = require("express");
const router = express.Router();
const Additem = require("../models/additem");
const Login = require("../models/Login"); // model ผู้ใช้
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
  const { jobId } = req.query; // ส่ง ?jobId=xxx

  if (!jobId) return res.status(400).json({ message: "jobId required" });

  try {
    const items = await Additem.find({ jobId });

    // map ให้ frontend ได้ใช้ชื่อ + รูป
    const formattedItems = items.map((item) => ({
      id: item._id,
      name: item.name,
      quantity: item.quantity,
      jobId: item.jobId,
      description: item.description,
      requesterName: item.requesterName || "ไม่ทราบ",
      requesterProfile: item.requesterProfile || "/default-profile.png",
      section: item.section,
      role: item.role,
      createdAt: item.createdAt, // <-- แก้ตรงนี้
    }));

    res.json(formattedItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// POST: เพิ่มรายการ (ดึง requester จาก token)
router.post("/", verifyToken, async (req, res) => {
  const { name, quantity, jobId, description, section, role } =
    req.body;

  if (!jobId) return res.status(400).json({ message: "jobId required" });

  try {
    // ดึงข้อมูลผู้ใช้จาก token
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
      createdAt: new Date(), //  กำหนดเวลาอัตโนมัติ
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
    await Additem.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
