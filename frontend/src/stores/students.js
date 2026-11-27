
import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_URL = '/api'

export const useStudentStore = defineStore('students', () => {
  const student = ref(null)
  const message = ref('')
  const errorMessage = ref('')

  const isSearching = ref(false)
  const isAdding = ref(false)
  const isDeleting = ref(false)

    async function searchStudent(name) {
    message.value = ''
    errorMessage.value = ''
    student.value = null
    isSearching.value = true

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
    } finally {
      isSearching.value = false
    }
  }

    async function addStudent(newStudent) {
    message.value = ''
    errorMessage.value = ''
    isAdding.value = true

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
    } finally {
      isAdding.value = false
    }
  }

    async function deleteStudent(name) {
    message.value = ''
    errorMessage.value = ''
    isDeleting.value = true

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
    } finally {
      isDeleting.value = false
    }
  }

    return {
    student,
    message,
    errorMessage,
    isSearching,
    isAdding,
    isDeleting,
    searchStudent,
    addStudent,
    deleteStudent
  }
})
