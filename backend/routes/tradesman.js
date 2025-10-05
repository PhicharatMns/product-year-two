const express = require("express");
const router = express.Router();
const Tradesman = require("../models/Tradesman");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/Tradesman"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + ".jpg");
  },
});

const upload = multer({
  storage: storage,
});

// create tradesman
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const newTradesman = new Tradesman({
      Name: req.body.Name,
      Nickname: req.body.Nickname,
      ID: req.body.ID,
      Birthday: req.body.Birthday,
      Address: req.body.Address,
      Phone_Number: req.body.Phone_Number,
      Email: req.body.Email,
      Profile: req.file ? req.file.filename : null,
      Position: req.body.Position,
      Start_data: Start_data || Date.now(),
    });
    await newTradesman.save();
    res.status(201).json(newTradesman);
  } catch (err) {
    res.status(500).json("error");
  }
});

module.exports = router;
