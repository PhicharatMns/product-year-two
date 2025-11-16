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

// PUT: แก้ไขรายการตาม id
router.put("/update-item/:id", async (req, res) => {
  try {
    const { name, category, number, counting } = req.body;
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { name, category, number, counting },
      { new: true } // คืนค่า document ที่อัปเดตแล้ว
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
