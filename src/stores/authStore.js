import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/authService'
import { useNotificationStore } from './notificationStore'

export const useAuthStore = defineStore('auth', () => {
  // Inicializamos leyendo de localStorage
  const token = ref(localStorage.getItem('access_token') || null)
  const refreshToken = ref(localStorage.getItem('refresh_token') || null)
  
  // CORRECCIÓN 1: Manejo seguro del JSON.parse para evitar errores si está vacío
  const getUserFromStorage = () => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null
    } catch {
      return null
    }
  }
  const user = ref(getUserFromStorage())
  
  const isLoading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  
  // CORRECCIÓN 2: Usar 'rol_nombre' que viene de tu backend
  const userRole = computed(() => user.value?.rol_nombre || null)
  
  const isAdmin = computed(() => userRole.value === 'Administrador')
  const isAccountant = computed(() => userRole.value === 'Contador')
  const isManager = computed(() => userRole.value === 'Encargado')

  const login = async (email, password) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await authService.login(email, password)
      
      // Actualizamos estado en Pinia
      token.value = response.access
      refreshToken.value = response.refresh
      user.value = response.user
      
      // Guardamos en LocalStorage
      localStorage.setItem('access_token', response.access)
      localStorage.setItem('refresh_token', response.refresh)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      return true
    } catch (err) {
      console.error(err)
      error.value = err.message || 'Error al iniciar sesión'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    token.value = null
    refreshToken.value = null
    user.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  }

  const refreshAccessToken = async () => {
    try {
      const response = await authService.refreshToken(refreshToken.value)
      token.value = response.access
      localStorage.setItem('access_token', response.access)
      return true
    } catch (err) {
      logout()
      return false
    }
  }

  return {
    token,
    refreshToken,
    user,
    isLoading,
    error,
    isAuthenticated,
    userRole,
    isAdmin,
    isAccountant,
    isManager,
    login,
    logout,
    refreshAccessToken,
  }
})