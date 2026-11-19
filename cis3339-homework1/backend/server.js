
require('dotenv').config();

const mongoose = require('mongoose');

const Student = require('./models/student');
const Course = require('./models/course');
const Enrollment = require('./models/enrollment');

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


 // Search for a student by name
app.post('/find-student', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        error: 'Student name is required'
      });
    }

    const student = await Student.findOne({
      name: name.trim()
    });

    if (!student) {
      return res.status(404).json({
        error: 'Student not found'
      });
    }

    res.json(student);
  } catch (error) {
    console.error('Error finding student:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Add a new student
app.post('/add-student', async (req, res) => {
  try {
    const { name, id, phone, zip } = req.body;

    if (![name, id, phone, zip].every(
      value => typeof value === 'string' && value.trim()
    )) {
      return res.status(400).json({
        error: 'All student fields are required'
      });
    }

    const newStudent = await Student.create({
      name: name.trim(),
      id: id.trim(),
      phone: phone.trim(),
      zip: zip.trim()
    });

    res.status(201).json({
      message: 'Student added successfully',
      student: newStudent
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error: 'Student ID already exists'
      });
    }

    console.error('Error adding student:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Delete a student by name
app.post('/delete-student', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        error: 'Student name is required'
      });
    }

    const student = await Student.findOne({
      name: name.trim()
    });

    if (!student) {
      return res.status(404).json({
        error: 'Student not found'
      });
    }

    // Remove enrollments associated with the student
    await Enrollment.deleteMany({
      studentId: student.id
    });

    await Student.deleteOne({ _id: student._id });

    res.json({
      message: 'Student deleted successfully',
      student
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});


// Start the server
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('Connected to MongoDB successfully!');

    await Promise.all([
      Student.init(),
      Course.init(),
      Enrollment.init()
    ]);

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();