<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCourseStore } from '../stores/courses'

const courseStore = useCourseStore()

const { courses, message, errorMessage } = storeToRefs(courseStore)

const newCourse = ref({
  courseId: '',
  courseName: ''
})

// Load courses when the page opens
onMounted(() => {
  courseStore.fetchCourses()
})

// Add a course
async function addCourse() {
  const success = await courseStore.addCourse(newCourse.value)

  if (success) {
    newCourse.value = {
      courseId: '',
      courseName: ''
    }
  }
}

// Delete a course
async function deleteCourse(courseId) {
  if (!confirm(`Delete course ${courseId}?`)) return

  await courseStore.deleteCourse(courseId)
}
</script>

<template>
  <section class="courses-page">
    <h2>Course Management</h2>

    <h3>Add a Course</h3>

    <form @submit.prevent="addCourse">
      <label for="courseId">Course ID:</label>
      <input
        id="courseId"
        v-model="newCourse.courseId"
        required
      />

      <label for="courseName">Course Name:</label>
      <input
        id="courseName"
        v-model="newCourse.courseName"
        required
      />

      <button type="submit">Add Course</button>
    </form>

    <p v-if="message" class="success">{{ message }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <h3>Course List</h3>

    <table v-if="courses.length">
      <thead>
        <tr>
          <th>Course ID</th>
          <th>Course Name</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="course in courses" :key="course.courseId">
          <td>{{ course.courseId }}</td>
          <td>{{ course.courseName }}</td>
          <td>
            <button @click="deleteCourse(course.courseId)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>No courses available.</p>
  </section>
</template>

<style scoped>
.courses-page {
  max-width: 700px;
  margin: 0 auto;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 25px;
}

input {
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

.success {
  color: #42b883;
}

.error {
  color: #ff5555;
}
</style>
