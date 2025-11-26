const express = require("express");
const router = express.Router();
const Login = require("../models/Login");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

//รับรูปมาเก็บในไฟล์ ../uploads/Profile
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/Profile"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

//JWT Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

//Register
router.post("/register", upload.single("Profile"), async (req, res) => {
  try {
    if (!req.body.username || !req.body.passwork) {
      return res
        .status(400)
        .json({ message: "Username and password required" });
    }

    const user = await Login.findOne({ username: req.body.username });
    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.passwork, 10);

    const newUser = new Login({
      username: req.body.username,
      passwork: hashedPassword,
      Name: req.body.Name,
      Nickname: req.body.Nickname,
      ID: req.body.ID,
      Birthday: req.body.Birthday,
      Address: req.body.Address,
      Phone_Number: req.body.Phone_Number,
      Email: req.body.Email,
      Profile: req.file ? req.file.filename : "",
      Position: req.body.Position,
      Start_data: req.body.Start_data,
      role: req.body.role,
      Salary: req.body.Salary,
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully!", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database Error" });
  }
});

//Login
router.post("/login", async (req, res) => {
  const { username, passwork } = req.body;
  if (!username || !passwork)
    return res.status(401).json({ message: "User or Passwork required" });

  try {
    const user = await Login.findOne({ username });
    if (!user)
      return res.status(401).json({ message: "Invalid user or password" });

    const isMatch = await bcrypt.compare(passwork, user.passwork);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid user or password" });

    // เก็บ id ลงใน token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
        Name: user.Name,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful!",
      token,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

//ลบข้อมูล
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Login.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "ไม่พบช่างนี้" });
    }

    if (deleted.Profile) {
      const filepath = path.join(
        __dirname,
        "../uploads/Profile",
        deleted.Profile
      );
      if (fs.existsSync(filepath)) {
        fs.unlink(filepath, (err) => {
          if (err) console.error("ลบรูปไม่สำเร็จ:", err);
        });
      }
    }

    res.status(200).json({ message: `ลบข้อมูล ${deleted.Name} สำเร็จ` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "ลบไม่สำเร็จ" });
  }
});

// *** จุดสำคัญที่แก้ไข *** path DashboardUser
// *** จุดที่ต้องแก้ไขใน Backend ***
router.get("/dashboardUser", verifyToken, async (req, res) => {
  try {
    const user = await Login.findById(req.user.id); // ใช้ req.user.id ที่ได้จาก token
    if (!user) return res.status(404).json({ message: "User not found" });

    // ส่งข้อมูลกลับไปให้ครบตามที่หน้าเว็บต้องการ
    res.json({
      username: user.username,
      Name: user.Name,
      Nickname: user.Nickname,
      ID: user.ID,
      Birthday: user.Birthday,
      Address: user.Address,
      Phone_Number: user.Phone_Number,
      Email: user.Email,
      Position: user.Position,
      Start_data: user.Start_data,
      Profile: user.Profile,
      Salary: user.Salary,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ดึงข้อมูลช่างมาเเสดง
router.get("/all-tradesman", async (req, res) => {
  try {
    const tradesman = await Login.find();
    res.json(tradesman);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database Error" });
  }
});

// เเก้ไขช่าง
router.put("/:id", upload.single("Profile"), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      username,
      passwork,
      Name,
      Nickname,
      ID,
      Birthday,
      Address,
      Phone_Number,
      Email,
      Position,
      Start_data,
      role,
      Salary,
    } = req.body;

    const user = await Login.findById(id);
    if (!user) return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });

    if (req.file) {
      if (user.Profile) {
        const oldFilePath = path.join(
          __dirname,
          "../uploads/Profile",
          user.Profile
        );
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      user.Profile = req.file.filename;
    }

    if (passwork) {
      const hashedPassword = await bcrypt.hash(passwork, 10);
      user.passwork = hashedPassword;
    }

    user.username = username || user.username;
    user.Name = Name || user.Name;
    user.Nickname = Nickname || user.Nickname;
    user.ID = ID || user.ID;
    user.Birthday = Birthday || user.Birthday;
    user.Address = Address || user.Address;
    user.Phone_Number = Phone_Number || user.Phone_Number;
    user.Email = Email || user.Email;
    user.Position = Position || user.Position;
    user.Start_data = Start_data || user.Start_data;
    user.role = role || user.role;
    user.Salary = Salary || user.Salary; // แก้บั๊กเดิมที่เขียนว่า user.Salary = role

    await user.save();

    res.status(200).json({ message: "อัปเดตข้อมูลสำเร็จ", user });
  } catch (err) {
    console.error("อัปเดตข้อมูลล้มเหลว:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดต" });
  }
});

// ดึงข้อมูลผู้ใช้เฉพาะ field ที่กำหนด
router.get("/", async (req, res) => {
  try {
    // ดึงเฉพาะ Name, Nickname, Profile, role, Position
    const users = await Login.find().select(
      "Name Nickname Profile role Position"
    );
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database Error" });
  }
});

module.exports = router;
