
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Students',
    component: () => import('../views/StudentsView.vue')
  },
  {
    path: '/courses',
    name: 'Courses',
    component: () => import('../views/CoursesView.vue')
  },
  {
    path: '/enrollments',
    name: 'Enrollments',
    component: () => import('../views/EnrollmentsView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
