<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-bold mb-4 dark:text-white">Guardar Simulación</h2>
      
      <!-- Mensaje de error -->
      <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ error }}
      </div>

      <!-- Selector de modo -->
      <div class="mb-6">
        <div class="flex space-x-4">
          <button 
            @click="cambiarModo('seleccionar')"
            :class="{'bg-blue-500 text-white': modo === 'seleccionar', 'bg-gray-200 dark:bg-gray-700': modo !== 'seleccionar'}"
            class="px-4 py-2 rounded-lg flex-1"
          >
            Seleccionar Cliente
          </button>
          <button 
            @click="cambiarModo('crear')"
            :class="{'bg-blue-500 text-white': modo === 'crear', 'bg-gray-200 dark:bg-gray-700': modo !== 'crear'}"
            class="px-4 py-2 rounded-lg flex-1"
          >
            Nuevo Cliente
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="clientesStore.loading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>

      <!-- Seleccionar cliente existente -->
      <div v-else-if="modo === 'seleccionar'" class="space-y-4">
        <div v-if="clientesStore.error" class="text-red-500 text-center py-4">
          {{ clientesStore.error }}
        </div>
        <div v-else-if="clientesStore.clientes.length === 0" class="text-center py-4">
          <p class="text-gray-500 dark:text-gray-400">No hay clientes registrados</p>
          <button 
            @click="cambiarModo('crear')"
            class="text-blue-500 hover:text-blue-600 mt-2"
          >
            Crear nuevo cliente
          </button>
        </div>
        <div v-else>
          <div class="max-h-60 overflow-y-auto space-y-2">
            <button
              v-for="cliente in clientesStore.clientes"
              :key="cliente.id"
              @click="seleccionarCliente(cliente)"
              class="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              :class="{'bg-blue-50 dark:bg-blue-900': clienteSeleccionado?.id === cliente.id}"
            >
              {{ cliente.nombre }} {{ cliente.apellido }}
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ cliente.email }}
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Crear nuevo cliente -->
      <div v-else class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre
          </label>
          <input
            v-model="nuevoCliente.nombre"
            type="text"
            class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            :class="{'border-red-500': errores.nombre}"
          >
          <p v-if="errores.nombre" class="mt-1 text-sm text-red-500">{{ errores.nombre }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Apellido
          </label>
          <input
            v-model="nuevoCliente.apellido"
            type="text"
            class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            :class="{'border-red-500': errores.apellido}"
          >
          <p v-if="errores.apellido" class="mt-1 text-sm text-red-500">{{ errores.apellido }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            v-model="nuevoCliente.email"
            type="email"
            class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            :class="{'border-red-500': errores.email}"
          >
          <p v-if="errores.email" class="mt-1 text-sm text-red-500">{{ errores.email }}</p>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="mt-6 flex space-x-4">
        <button
          @click="cerrar"
          class="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex-1"
          :disabled="clientesStore.loading"
        >
          Cancelar
        </button>
        <button
          @click="guardar"
          :disabled="!puedeGuardar || clientesStore.loading"
          class="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ clientesStore.loading ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useClientesStore } from '@/stores/clientes'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'guardar'])

const clientesStore = useClientesStore()
const modo = ref('seleccionar')
const clienteSeleccionado = ref(null)
const nuevoCliente = ref({
  nombre: '',
  apellido: '',
  email: ''
})
const error = ref(null)
const errores = ref({})

// Cargar clientes cuando se abre el modal
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    error.value = null
    errores.value = {}
    try {
      await clientesStore.cargarClientes()
    } catch (error) {
      console.error('Error al cargar clientes:', error)
    }
  }
})

const validarNuevoCliente = () => {
  const errors = {}
  
  if (!nuevoCliente.value.nombre.trim()) {
    errors.nombre = 'El nombre es requerido'
  }
  
  if (!nuevoCliente.value.apellido.trim()) {
    errors.apellido = 'El apellido es requerido'
  }
  
  if (!nuevoCliente.value.email.trim()) {
    errors.email = 'El email es requerido'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nuevoCliente.value.email)) {
    errors.email = 'El email no es válido'
  }
  
  errores.value = errors
  return Object.keys(errors).length === 0
}

const puedeGuardar = computed(() => {
  if (clientesStore.loading) return false
  if (modo.value === 'seleccionar') {
    return clienteSeleccionado.value !== null
  } else {
    return nuevoCliente.value.nombre && 
           nuevoCliente.value.apellido && 
           nuevoCliente.value.email
  }
})

const cambiarModo = (nuevoModo) => {
  modo.value = nuevoModo
  error.value = null
  errores.value = {}
}

const seleccionarCliente = (cliente) => {
  clienteSeleccionado.value = cliente
  error.value = null
}

const cerrar = () => {
  modo.value = 'seleccionar'
  clienteSeleccionado.value = null
  nuevoCliente.value = { nombre: '', apellido: '', email: '' }
  error.value = null
  errores.value = {}
  emit('close')
}

const guardar = async () => {
  error.value = null
  errores.value = {}
  
  try {
    let cliente
    if (modo.value === 'crear') {
      if (!validarNuevoCliente()) {
        return
      }
      cliente = await clientesStore.agregarCliente(nuevoCliente.value)
    } else {
      cliente = clienteSeleccionado.value
    }
    emit('guardar', cliente)
    cerrar()
  } catch (err) {
    error.value = err.message || 'Error al guardar'
    console.error('Error al guardar:', err)
  }
}
</script>
