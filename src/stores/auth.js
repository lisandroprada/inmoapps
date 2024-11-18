import { defineStore } from 'pinia'
import { auth } from '@/config/firebase'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)

  // Inicializar el estado de autenticación
  onAuthStateChanged(auth, (u) => {
    user.value = u
    loading.value = false
  })

  // Registro de usuario
  async function register(email, password) {
    try {
      error.value = null
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      return userCredential
    } catch (e) {
      error.value = e.message
      throw e
    }
  }

  // Inicio de sesión
  async function login(email, password) {
    try {
      error.value = null
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      return userCredential
    } catch (e) {
      error.value = e.message
      throw e
    }
  }

  // Cerrar sesión
  async function logout() {
    try {
      await signOut(auth)
      user.value = null
    } catch (e) {
      error.value = e.message
      throw e
    }
  }

  return {
    user,
    loading,
    error,
    register,
    login,
    logout
  }
})