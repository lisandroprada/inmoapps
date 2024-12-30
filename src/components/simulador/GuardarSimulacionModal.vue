<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-bold mb-4 dark:text-white">
        {{ clientesStore.clienteSeleccionado ? 'Confirmar Guardado' : 'Seleccionar Cliente' }}
      </h2>
      
      <!-- Mensaje de error -->
      <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ error }}
      </div>

      <!-- Cliente ya seleccionado -->
      <div v-if="clientesStore.clienteSeleccionado" class="mb-6">
        <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cliente Seleccionado</h4>
          <p class="text-gray-600 dark:text-gray-400">
            {{ clientesStore.clienteSeleccionado.nombre }} {{ clientesStore.clienteSeleccionado.apellido }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ clientesStore.clienteSeleccionado.email }}
          </p>
        </div>
        <button 
          @click="clientesStore.clienteSeleccionado = null"
          class="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Cambiar Cliente
        </button>
      </div>

      <!-- Selector de modo -->
      <div v-else class="mb-6">
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
      <div v-else-if="modo === 'seleccionar' && !clientesStore.clienteSeleccionado" class="space-y-4">
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
      <div v-else-if="modo === 'crear' && !clientesStore.clienteSeleccionado" class="space-y-4">
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

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Teléfono (opcional)
          </label>
          <input
            v-model="nuevoCliente.telefono"
            type="tel"
            class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Observaciones (opcional)
          </label>
          <textarea
            v-model="nuevoCliente.observaciones"
            rows="3"
            class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
          ></textarea>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="mt-6 flex justify-end space-x-3">
        <button
          @click="cerrar"
          class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          Cancelar
        </button>
        <button
          @click="guardar"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          :disabled="!puedeGuardar || clientesStore.loading"
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
    required: true,
    default: false
  }
})

const emit = defineEmits(['close', 'guardar'])

const clientesStore = useClientesStore()
const modo = ref('seleccionar')
const error = ref('')
const clienteSeleccionado = ref(null)
const nuevoCliente = ref({
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  observaciones: ''
})
const errores = ref({})

// Si no hay cliente seleccionado, mostrar el modal de selección
if (!clientesStore.clienteSeleccionado) {
  clientesStore.cargarClientes()
} else {
  clienteSeleccionado.value = clientesStore.clienteSeleccionado
}

function validarNuevoCliente() {
  errores.value = {}
  let valido = true

  if (!nuevoCliente.value.nombre?.trim()) {
    errores.value.nombre = 'El nombre es requerido'
    valido = false
  }

  if (!nuevoCliente.value.apellido?.trim()) {
    errores.value.apellido = 'El apellido es requerido'
    valido = false
  }

  if (!nuevoCliente.value.email?.trim()) {
    errores.value.email = 'El email es requerido'
    valido = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nuevoCliente.value.email)) {
    errores.value.email = 'El email no es válido'
    valido = false
  }

  return valido
}

const puedeGuardar = computed(() => {
  if (clientesStore.loading) return false
  if (clientesStore.clienteSeleccionado) return true
  if (modo.value === 'seleccionar') {
    return clienteSeleccionado.value !== null
  }
  if (modo.value === 'crear') {
    return nuevoCliente.value.nombre && nuevoCliente.value.apellido && nuevoCliente.value.email
  }
  return false
})

function cambiarModo(nuevoModo) {
  modo.value = nuevoModo
  error.value = ''
}

function seleccionarCliente(cliente) {
  clienteSeleccionado.value = cliente
  clientesStore.clienteSeleccionado = cliente
  error.value = ''
}

async function guardar() {
  if (clientesStore.clienteSeleccionado) {
    emit('guardar', clientesStore.clienteSeleccionado)
    cerrar()
    return
  }

  if (modo.value === 'crear') {
    if (!validarNuevoCliente()) return
    
    try {
      const nuevoClienteGuardado = await clientesStore.agregarCliente(nuevoCliente.value)
      clientesStore.clienteSeleccionado = nuevoClienteGuardado
      emit('guardar', nuevoClienteGuardado)
      cerrar()
    } catch (error) {
      console.error('Error al crear cliente:', error)
      error.value = 'Error al crear el cliente'
    }
  } else {
    if (!clienteSeleccionado.value) {
      error.value = 'Por favor, selecciona un cliente'
      return
    }
    emit('guardar', clienteSeleccionado.value)
    cerrar()
  }
}

function cerrar() {
  error.value = ''
  modo.value = 'seleccionar'
  clienteSeleccionado.value = null
  errores.value = {}
  emit('close')
}
</script>
