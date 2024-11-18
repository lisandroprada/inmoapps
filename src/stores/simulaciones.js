import { defineStore } from 'pinia'
import { db } from '@/config/firebase'
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore'
import { useAuthStore } from './auth'

export const useSimulacionesStore = defineStore('simulaciones', {
  state: () => ({
    simulaciones: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async guardarSimulacion(simulacion) {
      try {
        const authStore = useAuthStore()
        if (!authStore.user) throw new Error('Usuario no autenticado')

        // Validar que la simulación tenga los datos necesarios
        if (!simulacion.datosCliente?.nombre || !simulacion.datosCliente?.apellido) {
          throw new Error('La simulación debe incluir los datos del cliente')
        }

        const simulacionData = {
          ...simulacion,
          userId: authStore.user.uid,
          fechaCreacion: new Date().toISOString()
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
      this.loading = true
      this.error = null
      try {
        const authStore = useAuthStore()
        if (!authStore.user) {
          this.simulaciones = []
          return
        }

        const q = query(
          collection(db, 'simulaciones'),
          where('userId', '==', authStore.user.uid),
          orderBy('fechaCreacion', 'desc')
        )

        const querySnapshot = await getDocs(q)
        this.simulaciones = querySnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            datosCliente: data.datosCliente || {}
          }
        })
      } catch (error) {
        console.error('Error al cargar simulaciones:', error)
        this.error = 'Error al cargar las simulaciones'
        this.simulaciones = []
      } finally {
        this.loading = false
      }
    }
  }
})
