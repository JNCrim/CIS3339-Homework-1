
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
app.post('/api/find-student', async (req, res) => {
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
app.post('/api/add-student', async (req, res) => {
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
app.post('/api/delete-student', async (req, res) => {
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


 // Add a new course
app.post('/api/add-course', async (req, res) => {
  try {
    const { courseId, courseName } = req.body;

    if (![courseId, courseName].every(
      value => typeof value === 'string' && value.trim()
    )) {
      return res.status(400).json({
        error: 'Course ID and course name are required'
      });
    }

    const course = await Course.create({
      courseId: courseId.trim(),
      courseName: courseName.trim()
    });

    res.status(201).json({
      message: 'Course added successfully',
      course
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error: 'Course ID already exists'
      });
    }

    console.error('Error adding course:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// List all courses
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find().sort({ courseId: 1 });
    res.json(courses);
  } catch (error) {
    console.error('Error listing courses:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Delete a course
app.delete('/api/courses/:courseId', async (req, res) => {
  try {
    const course = await Course.findOne({
      courseId: req.params.courseId
    });

    if (!course) {
      return res.status(404).json({
        error: 'Course not found'
      });
    }

    await Enrollment.deleteMany({
      courseId: course.courseId
    });

    await Course.deleteOne({ _id: course._id });

    res.json({
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// List all students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ name: 1 });
    res.json(students);
  } catch (error) {
    console.error('Error listing students:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});


// Enroll a student in a course
app.post('/api/add-enrollment', async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    if (![studentId, courseId].every(
      value => typeof value === 'string' && value.trim()
    )) {
      return res.status(400).json({
        error: 'Student ID and course ID are required'
      });
    }

    const student = await Student.findOne({
      id: studentId.trim()
    });

    if (!student) {
      return res.status(404).json({
        error: 'Student not found'
      });
    }

    const course = await Course.findOne({
      courseId: courseId.trim()
    });

    if (!course) {
      return res.status(404).json({
        error: 'Course not found'
      });
    }

    const enrollment = await Enrollment.create({
      studentId: student.id,
      courseId: course.courseId
    });

    res.status(201).json({
      message: 'Student enrolled successfully',
      enrollment
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error: 'Student is already enrolled in this course'
      });
    }

    console.error('Error adding enrollment:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// List all enrollments
app.get('/api/enrollments', async (req, res) => {
  try {
    const enrollments = await Enrollment.find();

    const results = await Promise.all(
      enrollments.map(async enrollment => {
        const student = await Student.findOne({
          id: enrollment.studentId
        });

        const course = await Course.findOne({
          courseId: enrollment.courseId
        });

        return {
          _id: enrollment._id,
          studentId: enrollment.studentId,
          studentName: student?.name || 'Unknown student',
          courseId: enrollment.courseId,
          courseName: course?.courseName || 'Unknown course'
        };
      })
    );

    res.json(results);

  } catch (error) {
    console.error('Error listing enrollments:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Delete an enrollment
app.delete('/api/enrollments/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        error: 'Invalid enrollment ID'
      });
    }

    const enrollment = await Enrollment.findByIdAndDelete(
      req.params.id
    );

    if (!enrollment) {
      return res.status(404).json({
        error: 'Enrollment not found'
      });
    }

    res.json({
      message: 'Enrollment deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting enrollment:', error);
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