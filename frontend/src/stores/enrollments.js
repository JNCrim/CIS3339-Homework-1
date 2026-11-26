
import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_URL = 'http://localhost:3000'

export const useEnrollmentStore = defineStore('enrollments', () => {
  const students = ref([])
  const courses = ref([])
  const enrollments = ref([])
  const message = ref('')
  const errorMessage = ref('')

  // Retrieve students
  async function fetchStudents() {
    try {
      const response = await fetch(`${API_URL}/students`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load students')
      }

      students.value = data
    } catch (error) {
      errorMessage.value = error.message
    }
  }

  // Retrieve courses
  async function fetchCourses() {
    try {
      const response = await fetch(`${API_URL}/courses`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load courses')
      }

      courses.value = data
    } catch (error) {
      errorMessage.value = error.message
    }
  }

  // Retrieve enrollments
  async function fetchEnrollments() {
    try {
      const response = await fetch(`${API_URL}/enrollments`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load enrollments')
      }

      enrollments.value = data
    } catch (error) {
      errorMessage.value = error.message
    }
  }

  // Add an enrollment
  async function addEnrollment(enrollment) {
    message.value = ''
    errorMessage.value = ''

    try {
      const response = await fetch(`${API_URL}/add-enrollment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrollment)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to enroll student')
      }

      message.value = 'Student enrolled successfully!'
      await fetchEnrollments()

      return true
    } catch (error) {
      errorMessage.value = error.message
      return false
    }
  }

  // Delete an enrollment
  async function deleteEnrollment(id) {
    message.value = ''
    errorMessage.value = ''

    try {
      const response = await fetch(
        `${API_URL}/enrollments/${encodeURIComponent(id)}`,
        { method: 'DELETE' }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete enrollment')
      }

      message.value = 'Enrollment removed successfully!'
      await fetchEnrollments()
    } catch (error) {
      errorMessage.value = error.message
    }
  }

  return {
    students,
    courses,
    enrollments,
    message,
    errorMessage,
    fetchStudents,
    fetchCourses,
    fetchEnrollments,
    addEnrollment,
    deleteEnrollment
  }
})
