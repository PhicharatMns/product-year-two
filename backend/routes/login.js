const express = require("express");
const router = express.Router();
const Login = require("../models/Login");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_secret_key";

// สมัครสมาชิก
router.post("/register", async (req, res) => {
  try {
    const { user, pass } = req.body;
    if (!user || !pass)
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });

    const existingUser = await Login.findOne({ user });
    if (existingUser)
      return res.status(400).json({ message: "มีชื่อผู้ใช้นี้อยู่แล้ว" });

    const newUser = new Login({ user, pass });
    await newUser.save();

    res.json({ message: "สมัครสมาชิกสำเร็จ!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการสมัครสมาชิก" });
  }
});

// เข้าสู่ระบบ
router.post("/login", async (req, res) => {
  try {
    const { user, pass } = req.body;
    if (!user || !pass)
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });

    const foundUser = await Login.findOne({ user });
    if (!foundUser)
      return res
        .status(401)
        .json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });

    const isMatch = await foundUser.matchPassword(pass);
    if (!isMatch)
      return res
        .status(401)
        .json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });

    const token = jwt.sign(
      { id: foundUser._id, user: foundUser.user },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 2 * 1000,
    });

    res.json({ message: "เข้าสู่ระบบสำเร็จ", user: foundUser.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" });
  }
});

// ตรวจสอบการ login (สำหรับ PrivateRoute)

router.get("/check", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "ไม่ได้ login" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // ส่ง user role หรือ type ได้ถ้าต้องการ
    res.status(200).json({ message: "Login อยู่", user: decoded.user });
  } catch (err) {
    res.status(401).json({ message: "Token ไม่ถูกต้อง" });
  }
});

// ออกจากระบบ
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "ออกจากระบบสำเร็จ" });
});

module.exports = router;
