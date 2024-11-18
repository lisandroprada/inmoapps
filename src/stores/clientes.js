import { defineStore } from 'pinia'
import { db } from '@/config/firebase'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore'
import { useAuthStore } from './auth'

export const useClientesStore = defineStore('clientes', {
  state: () => ({
    clientes: [],
    clienteSeleccionado: null,
    loading: false,
    error: null
  }),

  actions: {
    async cargarClientes() {
      this.loading = true
      this.error = null
      try {
        const authStore = useAuthStore()
        if (!authStore.user) return

        const q = query(
          collection(db, 'clientes'),
          where('userId', '==', authStore.user.uid),
          orderBy('apellido', 'asc')
        )

        const querySnapshot = await getDocs(q)
        this.clientes = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      } catch (error) {
        console.error('Error al cargar clientes:', error)
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async agregarCliente(cliente) {
      this.loading = true
      this.error = null
      try {
        const authStore = useAuthStore()
        if (!authStore.user) throw new Error('Usuario no autenticado')

        const clienteData = {
          ...cliente,
          userId: authStore.user.uid,
          createdAt: new Date().toISOString()
        }

        const docRef = await addDoc(collection(db, 'clientes'), clienteData)
        const nuevoCliente = { id: docRef.id, ...clienteData }
        this.clientes.push(nuevoCliente)
        return nuevoCliente
      } catch (error) {
        console.error('Error al agregar cliente:', error)
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async actualizarCliente(id, datos) {
      this.loading = true
      this.error = null
      try {
        const docRef = doc(db, 'clientes', id)
        await updateDoc(docRef, {
          ...datos,
          updatedAt: new Date().toISOString()
        })
        
        const index = this.clientes.findIndex(c => c.id === id)
        if (index !== -1) {
          this.clientes[index] = { ...this.clientes[index], ...datos }
        }
      } catch (error) {
        console.error('Error al actualizar cliente:', error)
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async eliminarCliente(id) {
      this.loading = true
      this.error = null
      try {
        await deleteDoc(doc(db, 'clientes', id))
        this.clientes = this.clientes.filter(c => c.id !== id)
      } catch (error) {
        console.error('Error al eliminar cliente:', error)
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    setClienteSeleccionado(cliente) {
      this.clienteSeleccionado = cliente
    }
  }
})
