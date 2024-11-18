import { defineStore } from 'pinia'
import { db } from '@/config/firebase'
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore'
import { useAuthStore } from './auth'

export const useSimulacionesStore = defineStore('simulaciones', {
  state: () => ({
    simulaciones: []
  }),
  
  actions: {
    async guardarSimulacion(simulacion) {
      try {
        const authStore = useAuthStore()
        if (!authStore.user) throw new Error('Usuario no autenticado')

        const simulacionData = {
          ...simulacion,
          userId: authStore.user.uid,
          createdAt: new Date().toISOString()
        }

        const docRef = await addDoc(collection(db, 'simulaciones'), simulacionData)
        this.simulaciones.push({ id: docRef.id, ...simulacionData })
        return docRef.id
      } catch (error) {
        console.error('Error al guardar simulación:', error)
        throw error
      }
    },

    async cargarSimulaciones() {
      try {
        const authStore = useAuthStore()
        if (!authStore.user) return

        const q = query(
          collection(db, 'simulaciones'),
          where('userId', '==', authStore.user.uid),
          orderBy('createdAt', 'desc')
        )

        const querySnapshot = await getDocs(q)
        this.simulaciones = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      } catch (error) {
        console.error('Error al cargar simulaciones:', error)
        throw error
      }
    }
  }
})
