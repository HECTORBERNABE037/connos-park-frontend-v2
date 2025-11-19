import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '@/components/forms/LoginForm.vue'
import PasswordResetForm from '@/components/forms/PasswordResetForm.vue'

const routes = [
  { path: '/', redirect: '/login' }, 
  { path: '/login', component: LoginForm },
  { path: '/forgot-password', component: PasswordResetForm }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
