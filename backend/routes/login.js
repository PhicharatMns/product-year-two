const express = require("express");
const router = express.Router();
const Login = require("../models/Login");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");

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
    // เช็คค่าพื้นฐานก่อน
    if (!req.body.username || !req.body.passwork) {
      return res
        .status(400)
        .json({ message: "Username and password required" });
    }

    // ตรวจสอบว่ามี username ซ้ำหรือไม่
    const user = await Login.findOne({ username: req.body.username });
    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(req.body.passwork, 10);

    // สร้าง user ใหม่ โดยใช้ req.body ทั้งหมด
    const newUser = new Login({
      username: req.body.username,
      passwork: hashedPassword, // เข้ารหัสแล้ว
      Name: req.body.Name,
      Nickname: req.body.Nickname,
      ID: req.body.ID,
      Birthday: req.body.Birthday,
      Address: req.body.Address,
      Phone_Number: req.body.Phone_Number,
      Email: req.body.Email,
      Profile: req.file ? req.file.filename : "", // ถ้ามีรูปให้บันทึกชื่อไฟล์
      Position: req.body.Position,
      Start_data: req.body.Start_data,
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
    if (!isMatch) return res.status({ message: "error is Match" });

    const token = jwt.sign({ id: user._id, username: username }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login succesful!", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// path DashboardUser
// login.js
router.get("/dashboardUser", verifyToken, async (req, res) => {
  try {
    const user = await Login.findById(req.user.id); // req.user.id จาก token
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      Name: user.Name, // หรือ user.Username, user.Email
      Email: user.Email,
      Phone_Number: user.Phone_Number,
      Position: user.Position,
      Profile: user.Profile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ดึงข้อมูลช่างมาเเสดง ในหน้า Editacc
router.get("/all-tradesman", async (req, res) => {
  try {
    // ดึงเฉพาะ role = "user" (สมมติช่างคือ user)
    const tradesman = await Login.find({ role: "user" });
    res.json(tradesman);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database Error" });
  }
});

module.exports = router;
