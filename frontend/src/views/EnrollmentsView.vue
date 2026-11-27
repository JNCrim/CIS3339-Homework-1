
<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useEnrollmentStore } from '../stores/enrollments.js'
import StatusMessage from '../components/StatusMessage.vue'

const enrollmentStore = useEnrollmentStore()

const {
  students,
  courses,
  enrollments,
  message,
  errorMessage
} = storeToRefs(enrollmentStore)

const newEnrollment = ref({
  studentId: '',
  courseId: ''
})

// Selected course for filtering the enrollment list
const selectedCourse = ref('')

// Filter enrollments by the selected course
const filteredEnrollments = computed(() => {
  if (!selectedCourse.value) {
    return enrollments.value
  }

  return enrollments.value.filter(
    enrollment => enrollment.courseId === selectedCourse.value
  )
})

// Load data when the page opens
onMounted(async () => {
  message.value = ''
  errorMessage.value = ''

  await Promise.all([
    enrollmentStore.fetchStudents(),
    enrollmentStore.fetchCourses(),
    enrollmentStore.fetchEnrollments()
  ])
})

// Enroll a student
async function addEnrollment() {
  const success = await enrollmentStore.addEnrollment(
    newEnrollment.value
  )

  if (success) {
    newEnrollment.value = {
      studentId: '',
      courseId: ''
    }
  }
}

// Remove an enrollment
async function deleteEnrollment(id) {
  if (!confirm('Remove this enrollment?')) return

  await enrollmentStore.deleteEnrollment(id)
}
</script>

<template>
  <section class="enrollments-page">
    <h2>Enrollment Management</h2>

    <h3>Enroll a Student</h3>

    <form @submit.prevent="addEnrollment">

      <label for="studentId">Select Student:</label>

      <select
        id="studentId"
        v-model="newEnrollment.studentId"
        required
      >
        <option disabled value="">Select a student</option>

        <option
          v-for="student in students"
          :key="student.id"
          :value="student.id"
        >
          {{ student.id }} - {{ student.name }}
        </option>
      </select>

      <label for="courseId">Select Course:</label>

      <select
        id="courseId"
        v-model="newEnrollment.courseId"
        required
      >
        <option disabled value="">Select a course</option>

        <option
          v-for="course in courses"
          :key="course.courseId"
          :value="course.courseId"
        >
          {{ course.courseId }} - {{ course.courseName }}
        </option>
      </select>

      <button type="submit">Enroll Student</button>
    </form>

    <StatusMessage
      :message="message"
      :error-message="errorMessage"
    />
<h3>Enrollment List</h3>

<div class="course-filter">
  <label for="filterCourse">Filter by Course:</label>

  <select id="filterCourse" v-model="selectedCourse">
    <option value="">All Courses</option>

    <option
      v-for="course in courses"
      :key="course.courseId"
      :value="course.courseId"
    >
      {{ course.courseId }} - {{ course.courseName }}
    </option>
  </select>
</div>

<table v-if="filteredEnrollments.length">
      <thead>
        <tr>
          <th>Student ID</th>
          <th>Student Name</th>
          <th>Course ID</th>
          <th>Course Name</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        <tr
           v-for="enrollment in filteredEnrollments"
           :key="enrollment._id"
        >
          <td>{{ enrollment.studentId }}</td>
          <td>{{ enrollment.studentName }}</td>
          <td>{{ enrollment.courseId }}</td>
          <td>{{ enrollment.courseName }}</td>
          <td>
            <button @click="deleteEnrollment(enrollment._id)">
              Remove
            </button>
          </td>
        </tr>
      </tbody>
    </table>

<p v-else-if="selectedCourse">
  No students are enrolled in this course.
</p>

<p v-else>No enrollments available.</p>
  </section>
</template>

<style scoped>
.enrollments-page {
  max-width: 900px;
  margin: 0 auto;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 25px;
}

select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #36966d;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

th, td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

.course-filter {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.course-filter select {
  width: 100%;
}
</style>
