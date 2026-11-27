
<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useStudentStore } from '../stores/students'
import StatusMessage from '../components/StatusMessage.vue'
import BaseInput from '../components/BaseInput.vue'
import DataTable from '../components/DataTable.vue'

const studentStore = useStudentStore()

const { student, message, errorMessage } = storeToRefs(studentStore)

const searchName = ref('')

const newStudent = ref({
  name: '',
  id: '',
  phone: '',
  zip: ''
})

const studentColumns = [
  { key: 'name', label: 'Name' },
  { key: 'id', label: 'ID' },
  { key: 'phone', label: 'Phone' },
  { key: 'zip', label: 'ZIP' }
]

async function searchStudent() {
  await studentStore.searchStudent(searchName.value)
}

async function addStudent() {
  const success = await studentStore.addStudent(newStudent.value)

  if (success) {
    newStudent.value = {
      name: '',
      id: '',
      phone: '',
      zip: ''
    }
  }
}

async function deleteStudent() {
  if (!student.value) return

  if (!confirm(`Delete student ${student.value.name}?`)) {
    return
  }

  await studentStore.deleteStudent(student.value.name)
}
</script>

<template>
  <section class="students-page">
    <h2>Student Management</h2>

    <!-- Search Student -->
    <div class="form-section">
      <h3>Search for a Student</h3>

      <form @submit.prevent="searchStudent">
        <BaseInput
          id="searchName"
          label="Student Name:"
          v-model="searchName"
          required
        />
        <button type="submit">Search</button>
      </form>
    </div>

    <!-- Add Student -->
    <div class="form-section">
      <h3>Add a Student</h3>

      <form @submit.prevent="addStudent">
        <BaseInput
          id="name"
          label="Name:"
          v-model="newStudent.name"
          required
          />

        <BaseInput
          id="id"
          label="ID:"
          v-model="newStudent.id"
          required
        />

        <BaseInput
          id="phone"
          label="Phone:"
          v-model="newStudent.phone"
          required
        />

        <BaseInput
          id="zip"
          label="ZIP:"
          v-model="newStudent.zip"
          required
        />
        <button type="submit">Add Student</button>
      </form>
    </div>

    <!-- Success/Error Messages -->
    <StatusMessage
    :message="message"
    :error-message="errorMessage"
    />

    <!-- Search Results -->
    <div class="form-section">
      <h3>Result:</h3>

      <DataTable
        v-if="student"
        :columns="studentColumns"
        :rows="[student]"
         row-key="id"
        >
          <template #actions>
            <button @click="deleteStudent">
              Delete
            </button>
          </template>
        </DataTable>

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
</style>
