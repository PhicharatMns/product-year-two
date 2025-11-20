const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
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

// POST /add-item
router.post("/add-item", async (req, res) => {
  try {
    const { name, category, number } = req.body;

    // number ต้องเป็น number
    const numValue = Number(number);

    if (isNaN(numValue)) {
      return res.status(400).json({ message: "จำนวนต้องเป็นตัวเลข" });
    }

    // ตรวจสอบว่ามี item ชื่อเดียวกันใน category เดียวกันหรือไม่
    const existingItem = await Item.findOne({ name, category });

    if (existingItem) {
      // รวมจำนวน
      existingItem.counting.value += numValue;
      existingItem.counting.timestamp = new Date(); // อัปเดตเวลา
      await existingItem.save();
      return res.status(200).json({
        message: "อัปเดตจำนวนรายการที่มีอยู่แล้ว",
        item: existingItem,
      });
    }

    // ถ้าไม่มีซ้ำ → สร้างใหม่
    const newItem = new Item({
      name,
      category,
      number: number.toString(),
      counting: {
        value: numValue,
        timestamp: new Date(),
      },
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" });
  }
});

// GET: ดึงข้อมูลวัสดุทั้งหมด
router.get("/all-items", async (req, res) => {
  try {
    const items = await Item.find(); // ดึงข้อมูลทั้งหมดจาก MongoDB
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
});

// PUT /update-item/:id
router.put("/update-item/:id", async (req, res) => {
  try {
    const { name, category, number } = req.body;
    const numValue = Number(number);

    if (isNaN(numValue)) {
      return res.status(400).json({ message: "จำนวนต้องเป็นตัวเลข" });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        number: number.toString(),
        counting: {
          value: numValue,
          timestamp: new Date(),
        },
      },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "ไม่พบรายการนี้" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล" });
  }
});

// DELETE: ลบรายการตาม id
router.delete("/delete-item/:id", async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: "ไม่พบรายการนี้" });
    }

    res
      .status(200)
      .json({ message: "ลบรายการเรียบร้อยแล้ว", item: deletedItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบข้อมูล" });
  }
});

module.exports = router;
