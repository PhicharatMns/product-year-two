const express = require("express");
const router = express.Router();
const Login = require("../models/Login");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
router.post("/register", async (req, res) => {
  const { username, passwork } = req.body;
  if (!username || !passwork)
    return res.status(400).json({ message: "Usernama and password required" });

  try {
    const user = await Login.findOne({ username });
    if (user) return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(passwork, 10);
    const newUser = new Login({ username, passwork: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "user registered successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Datadase Error" });
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
router.get("/dashboardUser", verifyToken, (req, res) => {
  console.log("req.user:", req.user);
  res.json({ message: ` ${req.user.username}` });
});


module.exports = router;
