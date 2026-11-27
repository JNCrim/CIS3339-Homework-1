<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCourseStore } from '../stores/course'
import BaseInput from '../components/BaseInput.vue'
import StatusMessage from '../components/StatusMessage.vue'
import DataTable from '../components/DataTable.vue'

const courseStore = useCourseStore()

const { courses, message, errorMessage } = storeToRefs(courseStore)

const newCourse = ref({
  courseId: '',
  courseName: ''
})

const courseColumns = [
  { key: 'courseId', label: 'Course ID' },
  { key: 'courseName', label: 'Course Name' }
]

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
      <BaseInput
        id="courseId"
        label="Course ID:"
        v-model="newCourse.courseId"
        required
      />

      <BaseInput
        id="courseName"
        label="Course Name:"
        v-model="newCourse.courseName"
        required
      />

      <button type="submit">Add Course</button>
    </form>

    <StatusMessage
      :message="message"
      :error-message="errorMessage"
    />

    <h3>Course List</h3>

    <DataTable
      v-if="courses.length"
      :columns="courseColumns"
      :rows="courses"
      row-key="courseId"
    >
      <template #actions="{ row }">
        <button @click="deleteCourse(row.courseId)">
          Delete
        </button>
      </template>
    </DataTable>

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
