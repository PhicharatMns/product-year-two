const express = require('express');
const router = express.Router();
const Employees = require('../models/employee');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// CREATE
// router.post('/', upload.single('image'), async (req, res) => {
//   try {
//     const { name, salary } = req.body;
//     const image = req.file ? req.file.filename : '';
//     const employee = new Employees({ name, salary, image });
//     await employee.save();
//     res.status(201).json(employee);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// CREATE
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const employee = new Employees({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      email: req.body.email,
      phone: req.body.phone,
      position: req.body.position,
      department: req.body.department,
      hireDate: req.body.hireDate,
      salary: req.body.salary,
      profileImage: req.file ? req.file.filename : ''
    });
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// READ all
router.get('/', async (req, res) => {
  try {
    const employees = await Employees.find();
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employees.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Not found' });

    // ลบไฟล์รูปถ้ามี
    if (employee.profileImage) {
      const filepath = path.join(__dirname, '../uploads', employee.profileImage);
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    }

    await Employees.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
