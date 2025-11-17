// routes/additem.js
const express = require("express");
const router = express.Router();
const Additem = require("../models/additem");

// GET: ดึงรายการทั้งหมดของงาน
router.get("/", async (req, res) => {
  const { jobId } = req.query; // ส่ง ?jobId=xxx

  if (!jobId) return res.status(400).json({ message: "jobId required" });

  try {
    const items = await Additem.find({ jobId }).populate({
      path: "requesterId",
      select: "Worksheet profilePicture", // สมมติใน Employee มี profilePicture
    });

    // map ให้ frontend ได้ใช้ชื่อ + รูป
    const formattedItems = items.map((item) => ({
      id: item._id,
      name: item.name,
      quantity: item.quantity,
      jobId: item.jobId,
      description: item.description,
      requesterName: item.requesterId?.Worksheet || "ไม่ทราบ",
      requesterProfile:
        item.requesterId?.profilePicture || "/default-profile.png",
    }));

    res.json(formattedItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: เพิ่มรายการ
router.post("/", async (req, res) => {
  const { name, quantity, jobId, description, requesterId } = req.body;

  if (!jobId) return res.status(400).json({ message: "jobId required" });

  const newItem = new Additem({
    name,
    quantity,
    jobId,
    description,
    requesterId,
  });

  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
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

app.get("/api/additem", async (req, res) => {
  const { jobId } = req.query;
  const items = await AddItem.find({ jobId }).populate({
    path: "requesterId",
    select: "Worksheet Profile", // หรือชื่อ/รูปโปรไฟล์
  });
  res.json(items);
});

module.exports = router;
