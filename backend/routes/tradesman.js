const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Tradesman = require("../models/Tradesman");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_secret_key";

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

// POST new tradesman (สร้าง admin หรือ user)
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
      User,
      Pass,
      role, // ส่ง role ได้ ["admin", "user"]
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
      User,
      Pass,
      Role: role || "user", // default เป็น user
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
      const filePath = path.join(
        __dirname,
        "../uploads/Tradesman",
        deleted.Profile
      );
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    res.json({ message: "ลบข้อมูลสำเร็จ" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "ลบไม่สำเร็จ" });
  }
});

// UPDATE tradesman by ID
router.put("/:id", upload.single("Profile"), async (req, res) => {
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
      User,
      Pass,
      role,
    } = req.body;

    const tradesman = await Tradesman.findById(req.params.id);
    if (!tradesman) {
      return res.status(404).json({ message: "ไม่พบช่าง" });
    }

    tradesman.Name = Name !== undefined ? Name : tradesman.Name;
    tradesman.Nickname = Nickname !== undefined ? Nickname : tradesman.Nickname;
    tradesman.ID = ID !== undefined ? ID : tradesman.ID;
    tradesman.Birthday = Birthday !== undefined ? Birthday : tradesman.Birthday;
    tradesman.Address = Address !== undefined ? Address : tradesman.Address;
    tradesman.Phone_Number =
      Phone_Number !== undefined ? Phone_Number : tradesman.Phone_Number;
    tradesman.Email = Email !== undefined ? Email : tradesman.Email;
    tradesman.Position = Position !== undefined ? Position : tradesman.Position;
    tradesman.Start_data =
      Start_data !== undefined ? Start_data : tradesman.Start_data;
    tradesman.User = User !== undefined ? User : tradesman.User;
    tradesman.Pass = Pass !== undefined ? Pass : tradesman.Pass;
    tradesman.Role = role !== undefined ? role : tradesman.Role;

    // อัปเดตรูปภาพ ถ้ามีไฟล์ใหม่
    if (req.file) {
      if (tradesman.Profile) {
        const oldFilePath = path.join(
          __dirname,
          "../uploads/Tradesman",
          tradesman.Profile
        );
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      }
      tradesman.Profile = req.file.filename;
    }

    await tradesman.save();
    res.json(tradesman);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "แก้ไขข้อมูลช่างไม่สำเร็จ" });
  }
});

// LOGIN tradesman
router.post("/login", async (req, res) => {
  try {
    const { User, Pass } = req.body;

    if (!User || !Pass) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
    }

    const tradesman = await Tradesman.findOne({ User, Pass });
    if (!tradesman) {
      return res
        .status(401)
        .json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }

    // สร้าง JWT
    const token = jwt.sign(
      { id: tradesman._id, user: tradesman.User, role: tradesman.role }, // ใช้ role ตัวเล็ก
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ส่ง token + role กลับให้ frontend
    res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ",
      role: tradesman.role, // ตัวเล็ก
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
});

// ตรวจสอบ token
router.get("/check", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token
  if (!token) return res.status(401).json({ message: "ไม่ได้ login" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).json({
      message: "Login อยู่",
      user: decoded.user,
      role: decoded.role,
    });
  } catch (err) {
    res.status(401).json({ message: "Token ไม่ถูกต้อง" });
  }
});

module.exports = router;
