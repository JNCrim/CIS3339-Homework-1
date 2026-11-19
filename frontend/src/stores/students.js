
import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_URL = 'http://localhost:3000'

export const useStudentStore = defineStore('students', () => {
  const student = ref(null)
  const message = ref('')
  const errorMessage = ref('')

  async function searchStudent(name) {
    message.value = ''
    errorMessage.value = ''
    student.value = null

    try {
      const response = await fetch(`${API_URL}/find-student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Student not found')
      }

      student.value = data
    } catch (error) {
      errorMessage.value = error.message
    }
  }

  async function addStudent(newStudent) {
    message.value = ''
    errorMessage.value = ''

    try {
      const response = await fetch(`${API_URL}/add-student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add student')
      }

      message.value = 'Student added successfully!'
      return true
    } catch (error) {
      errorMessage.value = error.message
      return false
    }
  }

  async function deleteStudent(name) {
    message.value = ''
    errorMessage.value = ''

    try {
      const response = await fetch(`${API_URL}/delete-student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete student')
      }

      student.value = null
      message.value = 'Student deleted successfully!'
      return true
    } catch (error) {
      errorMessage.value = error.message
      return false
    }
  }

  return {
    student,
    message,
    errorMessage,
    searchStudent,
    addStudent,
    deleteStudent
  }
})
