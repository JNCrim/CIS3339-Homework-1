

<script setup>
import { ref } from 'vue'

// Backend API address
const API_URL = 'http://localhost:3000'

// Search functionality
const searchName = ref('')
const student = ref(null)

// Add student form
const newStudent = ref({
  name: '',
  id: '',
  phone: '',
  zip: ''
})

// Messages
const message = ref('')
const errorMessage = ref('')

// Search for a student
async function searchStudent() {
  message.value = ''
  errorMessage.value = ''
  student.value = null

  try {
    const response = await fetch(`${API_URL}/find-student`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: searchName.value })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Student not found')
    }

    student.value = await response.json()
  } catch (error) {
    errorMessage.value = error.message
  }
}

// Add a student
async function addStudent() {
  message.value = ''
  errorMessage.value = ''

  try {
    const response = await fetch(`${API_URL}/add-student`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newStudent.value)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to add student')
    }

    message.value = 'Student added successfully!'

    newStudent.value = {
      name: '',
      id: '',
      phone: '',
      zip: ''
    }
  } catch (error) {
    errorMessage.value = error.message
  }
}

// Delete a student
async function deleteStudent() {
  if (!student.value) return

  if (!confirm(`Delete student ${student.value.name}?`)) {
    return
  }

  message.value = ''
  errorMessage.value = ''

  try {
    const response = await fetch(`${API_URL}/delete-student`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: student.value.name })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete student')
    }

    student.value = null
    message.value = 'Student deleted successfully!'
  } catch (error) {
    errorMessage.value = error.message
  }
}
</script>

<template>
  <section class="students-page">
    <h2>Student Management</h2>

    <!-- Search Student -->
    <div class="form-section">
      <h3>Search for a Student</h3>

      <form @submit.prevent="searchStudent">
        <label for="searchName">Student Name:</label>
        <input
          id="searchName"
          v-model="searchName"
          type="text"
          required
        />
        <button type="submit">Search</button>
      </form>
    </div>

    <!-- Add Student -->
    <div class="form-section">
      <h3>Add a Student</h3>

      <form @submit.prevent="addStudent">
        <label for="name">Name:</label>
        <input id="name" v-model="newStudent.name" required />

        <label for="id">ID:</label>
        <input id="id" v-model="newStudent.id" required />

        <label for="phone">Phone:</label>
        <input id="phone" v-model="newStudent.phone" required />

        <label for="zip">ZIP:</label>
        <input id="zip" v-model="newStudent.zip" required />

        <button type="submit">Add Student</button>
      </form>
    </div>

    <!-- Success/Error Messages -->
    <p v-if="message" class="success">{{ message }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <!-- Search Results -->
    <div class="form-section">
      <h3>Result:</h3>

      <table v-if="student">
        <thead>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>Phone</th>
            <th>ZIP</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>{{ student.name }}</td>
            <td>{{ student.id }}</td>
            <td>{{ student.phone }}</td>
            <td>{{ student.zip }}</td>
            <td>
              <button @click="deleteStudent">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else>No student selected.</p>
    </div>
  </section>
</template>

<style scoped>
.students-page {
  max-width: 700px;
  margin: 0 auto;
}

.form-section {
  margin-bottom: 30px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
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
