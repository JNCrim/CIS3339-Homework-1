
import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_URL = '/api'

export const useEnrollmentStore = defineStore('enrollments', () => {
  const students = ref([])
  const courses = ref([])
  const enrollments = ref([])
  const message = ref('')
  const errorMessage = ref('')

  const isLoadingStudents = ref(false)
  const isLoadingCourses = ref(false)
  const isLoadingEnrollments = ref(false)
  const isAdding = ref(false)
  const isDeleting = ref(false)

    // Retrieve students
  async function fetchStudents() {
    isLoadingStudents.value = true

    try {
      const response = await fetch(`${API_URL}/students`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load students')
      }

      students.value = data
    } catch (error) {
      errorMessage.value = error.message
    } finally {
      isLoadingStudents.value = false
    }
  }

    // Retrieve courses
  async function fetchCourses() {
    isLoadingCourses.value = true

    try {
      const response = await fetch(`${API_URL}/courses`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load courses')
      }

      courses.value = data
    } catch (error) {
      errorMessage.value = error.message
    } finally {
      isLoadingCourses.value = false
    }
  }

    // Retrieve enrollments
  async function fetchEnrollments() {
    isLoadingEnrollments.value = true

    try {
      const response = await fetch(`${API_URL}/enrollments`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load enrollments')
      }

      enrollments.value = data
    } catch (error) {
      errorMessage.value = error.message
    } finally {
      isLoadingEnrollments.value = false
    }
  }

   // Add an enrollment
  async function addEnrollment(enrollment) {
    message.value = ''
    errorMessage.value = ''
    isAdding.value = true

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
    } finally {
      isAdding.value = false
    }
  }

    // Delete an enrollment
  async function deleteEnrollment(id) {
    message.value = ''
    errorMessage.value = ''
    isDeleting.value = true

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
    } finally {
      isDeleting.value = false
    }
  }

    return {
    students,
    courses,
    enrollments,
    message,
    errorMessage,
    isLoadingStudents,
    isLoadingCourses,
    isLoadingEnrollments,
    isAdding,
    isDeleting,
    fetchStudents,
    fetchCourses,
    fetchEnrollments,
    addEnrollment,
    deleteEnrollment
  }
})
