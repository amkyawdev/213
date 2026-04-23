import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('burme_token') || null)
  const user = ref(JSON.parse(localStorage.getItem('burme_user') || 'null'))
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function login(username, password) {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password
      })
      
      token.value = response.data.access_token
      localStorage.setItem('burme_token', token.value)
      
      // Fetch user profile
      await fetchUser()
      
      return true
    } catch (err) {
      error.value = err.response?.data?.detail || 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(username, email, password) {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password
      })
      
      token.value = response.data.access_token
      localStorage.setItem('burme_token', token.value)
      
      // Fetch user profile
      await fetchUser()
      
      return true
    } catch (err) {
      error.value = err.response?.data?.detail || 'Registration failed'
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchUser() {
    if (!token.value) return
    
    try {
      const response = await axios.get(`${API_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token.value}` }
      })
      
      user.value = response.data
      localStorage.setItem('burme_user', JSON.stringify(user.value))
    } catch (err) {
      logout()
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('burme_token')
    localStorage.removeItem('burme_user')
  }

  function getAuthHeader() {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {}
  }

  // Initialize - try to fetch user if we have a token
  if (token.value) {
    fetchUser()
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    fetchUser,
    getAuthHeader
  }
})