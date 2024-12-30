import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useAuthStore } from './auth'

export const useConfigStore = defineStore('config', () => {
  const db = getFirestore()
  const storage = getStorage()
  const authStore = useAuthStore()
  
  const config = ref(null)
  const isDarkMode = ref(localStorage.getItem('darkMode') === 'true')

  // Cargar configuración
  const loadConfig = async () => {
    try {
      const userId = authStore.user?.uid
      if (!userId) return null

      const docRef = doc(db, 'configuracion', userId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        config.value = docSnap.data()
        return config.value
      }
      return null
    } catch (error) {
      console.error('Error al cargar la configuración:', error)
      throw error
    }
  }

  // Guardar configuración
  const saveConfig = async (newConfig) => {
    try {
      const userId = authStore.user?.uid
      if (!userId) throw new Error('Usuario no autenticado')

      const docRef = doc(db, 'configuracion', userId)
      await setDoc(docRef, newConfig)
      config.value = newConfig
    } catch (error) {
      console.error('Error al guardar la configuración:', error)
      throw error
    }
  }

  // Subir logo
  const uploadLogo = async (file) => {
    try {
      const userId = authStore.user?.uid
      if (!userId) throw new Error('Usuario no autenticado')

      const logoRef = storageRef(storage, `logos/${userId}/${file.name}`)
      await uploadBytes(logoRef, file)
      const downloadURL = await getDownloadURL(logoRef)
      return downloadURL
    } catch (error) {
      console.error('Error al subir el logo:', error)
      throw error
    }
  }

  // Toggle modo oscuro
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('darkMode', isDarkMode.value)
    document.documentElement.classList.toggle('dark', isDarkMode.value)
  }

  // Inicializar modo oscuro
  const initDarkMode = () => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    isDarkMode.value = savedDarkMode
    document.documentElement.classList.toggle('dark', savedDarkMode)
  }

  return {
    config,
    loadConfig,
    saveConfig,
    uploadLogo,
    isDarkMode,
    toggleDarkMode,
    initDarkMode
  }
})
