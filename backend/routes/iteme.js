const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// ตัวอย่างตั้งชื่อ route เป็น /add-item
router.post("/add-item", async (req, res) => {
  try {
    const { name, category, number, counting } = req.body;

    const newItem = new Item({
      name,
      category,
      number,
      counting,
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

module.exports = router;
