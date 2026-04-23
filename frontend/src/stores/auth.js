import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('burme_token') || null)
  const user = ref(JSON.parse(localStorage.getItem('burme_user') || 'null'))
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function login(email, password) {
    loading.value = true
    error.value = null
    
    try {
      // Firebase Login
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password)
      const idToken = await userCredential.user.getIdToken()
      
      token.value = idToken
      localStorage.setItem('burme_token', idToken)
      
      // Set user info from Firebase
      user.value = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        emailVerified: userCredential.user.emailVerified
      }
      localStorage.setItem('burme_user', JSON.stringify(user.value))
      
      return true
    } catch (err) {
      error.value = getFirebaseErrorMessage(err.code)
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(email, password) {
    loading.value = true
    error.value = null
    
    try {
      // Firebase Register
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password)
      const idToken = await userCredential.user.getIdToken()
      
      token.value = idToken
      localStorage.setItem('burme_token', idToken)
      
      // Set user info from Firebase
      user.value = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        emailVerified: userCredential.user.emailVerified
      }
      localStorage.setItem('burme_user', JSON.stringify(user.value))
      
      return true
    } catch (err) {
      error.value = getFirebaseErrorMessage(err.code)
      return false
    } finally {
      loading.value = false
    }
  }

  async function resetPassword(email) {
    loading.value = true
    error.value = null
    
    try {
      await firebase.auth().sendPasswordResetEmail(email)
      return true
    } catch (err) {
      error.value = getFirebaseErrorMessage(err.code)
      return false
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await firebase.auth().signOut()
    } catch (err) {
      console.error('Logout error:', err)
    }
    
    token.value = null
    user.value = null
    localStorage.removeItem('burme_token')
    localStorage.removeItem('burme_user')
  }

  function getAuthHeader() {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {}
  }

  function getFirebaseErrorMessage(code) {
    const messages = {
      'auth/email-already-in-use': 'Email already in use',
      'auth/invalid-email': 'Invalid email address',
      'auth/operation-not-allowed': 'Operation not allowed',
      'auth/weak-password': 'Password is too weak',
      'auth/user-disabled': 'User account disabled',
      'auth/user-not-found': 'User not found',
      'auth/wrong-password': 'Invalid password',
      'auth/too-many-requests': 'Too many requests. Please try again later',
      'auth/network-request-failed': 'Network error. Please check your connection',
      'auth/invalid-credential': 'Invalid credentials'
    }
    return messages[code] || 'Authentication failed'
  }

  // Initialize - check Firebase auth state
  firebase.auth().onAuthStateChanged(async (firebaseUser) => {
    if (firebaseUser) {
      const idToken = await firebaseUser.getIdToken()
      token.value = idToken
      localStorage.setItem('burme_token', idToken)
      
      user.value = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        emailVerified: firebaseUser.emailVerified
      }
      localStorage.setItem('burme_user', JSON.stringify(user.value))
    } else {
      token.value = null
      user.value = null
      localStorage.removeItem('burme_token')
      localStorage.removeItem('burme_user')
    }
  })

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    resetPassword,
    logout,
    getAuthHeader
  }
})
