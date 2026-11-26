
import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_URL = 'http://localhost:3000'

export const useCourseStore = defineStore('courses', () => {
  const courses = ref([])
  const message = ref('')
  const errorMessage = ref('')

  async function fetchCourses() {
    errorMessage.value = ''

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

  async function addCourse(course) {
    message.value = ''
    errorMessage.value = ''

    try {
      const response = await fetch(`${API_URL}/add-course`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add course')
      }

      message.value = 'Course added successfully!'
      await fetchCourses()
      return true
    } catch (error) {
      errorMessage.value = error.message
      return false
    }
  }

  async function deleteCourse(courseId) {
    message.value = ''
    errorMessage.value = ''

    try {
      const response = await fetch(
        `${API_URL}/courses/${encodeURIComponent(courseId)}`,
        { method: 'DELETE' }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete course')
      }

      message.value = 'Course deleted successfully!'
      await fetchCourses()
    } catch (error) {
      errorMessage.value = error.message
    }
  }

  return {
    courses,
    message,
    errorMessage,
    fetchCourses,
    addCourse,
    deleteCourse
  }
})
