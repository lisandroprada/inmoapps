<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Clientes
      </h1>
      <button
        @click="abrirModal()"
        class="bg-uva-primary-600 hover:bg-uva-primary-700 text-white px-4 py-2 rounded-lg"
      >
        Agregar Cliente
      </button>
    </div>

    <!-- Tabla de Clientes -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Nombre
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Teléfono
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Simulaciones
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="cliente in clientesStore.clientes" :key="cliente.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap">
                {{ cliente.apellido }}, {{ cliente.nombre }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ cliente.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ cliente.telefono }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ cliente.simulaciones?.length || 0 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button
                  @click="abrirModal(cliente)"
                  class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Editar
                </button>
                <button
                  @click="seleccionarCliente(cliente)"
                  class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                >
                  Seleccionar
                </button>
                <button
                  @click="confirmarEliminacion(cliente)"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  Eliminar
                </button>
              </td>
            </tr>
            <tr v-if="clientesStore.clientes.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                No hay clientes registrados
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Cliente -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
        <div class="p-6">
          <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            {{ clienteEditando ? 'Editar Cliente' : 'Nuevo Cliente' }}
          </h2>
          <form @submit.prevent="guardarCliente" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre
              </label>
              <input
                v-model="formData.nombre"
                type="text"
                required
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Apellido
              </label>
              <input
                v-model="formData.apellido"
                type="text"
                required
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                v-model="formData.email"
                type="email"
                required
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Teléfono
              </label>
              <input
                v-model="formData.telefono"
                type="tel"
                required
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Observaciones
              </label>
              <textarea
                v-model="formData.observaciones"
                rows="3"
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              ></textarea>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                @click="showModal = false"
                class="px-4 py-2 border rounded-lg text-gray-700 dark:text-gray-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-uva-primary-600 text-white rounded-lg hover:bg-uva-primary-700"
              >
                {{ clienteEditando ? 'Actualizar' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmación de Eliminación -->
    <div v-if="showConfirmDelete" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
        <h3 class="text-lg font-bold mb-4 text-gray-900 dark:text-white">
          Confirmar Eliminación
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          ¿Estás seguro que deseas eliminar al cliente {{ clienteAEliminar?.nombre }} {{ clienteAEliminar?.apellido }}?
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showConfirmDelete = false"
            class="px-4 py-2 border rounded-lg text-gray-700 dark:text-gray-300"
          >
            Cancelar
          </button>
          <button
            @click="eliminarCliente"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Notificación -->
    <div
      v-if="showNotification"
      class="fixed bottom-4 right-4 p-4 rounded-lg text-white"
      :class="notificationType === 'success' ? 'bg-green-500' : 'bg-red-500'"
    >
      {{ notificationMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useClientesStore } from '@/stores/clientes'
import { useRouter } from 'vue-router'

const router = useRouter()
const clientesStore = useClientesStore()

// Estado local
const showModal = ref(false)
const showConfirmDelete = ref(false)
const clienteEditando = ref(null)
const clienteAEliminar = ref(null)
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref('success')

const formData = ref({
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  observaciones: ''
})

// Cargar clientes al montar el componente
onMounted(async () => {
  await clientesStore.cargarClientes()
})

// Mostrar notificación
const showNotificationMessage = (message, type = 'success') => {
  notificationMessage.value = message
  notificationType.value = type
  showNotification.value = true
  setTimeout(() => {
    showNotification.value = false
  }, 3000)
}

// Abrir modal para nuevo cliente o edición
const abrirModal = (cliente = null) => {
  clienteEditando.value = cliente
  if (cliente) {
    formData.value = { ...cliente }
  } else {
    formData.value = {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      observaciones: ''
    }
  }
  showModal.value = true
}

// Guardar o actualizar cliente
const guardarCliente = async () => {
  try {
    if (clienteEditando.value) {
      await clientesStore.actualizarCliente(clienteEditando.value.id, formData.value)
      showNotificationMessage('Cliente actualizado exitosamente')
    } else {
      await clientesStore.agregarCliente(formData.value)
      showNotificationMessage('Cliente agregado exitosamente')
    }
    showModal.value = false
  } catch (error) {
    showNotificationMessage(
      'Error al ' + (clienteEditando.value ? 'actualizar' : 'agregar') + ' el cliente',
      'error'
    )
  }
}

// Confirmar eliminación
const confirmarEliminacion = (cliente) => {
  clienteAEliminar.value = cliente
  showConfirmDelete.value = true
}

// Eliminar cliente
const eliminarCliente = async () => {
  try {
    await clientesStore.eliminarCliente(clienteAEliminar.value.id)
    showNotificationMessage('Cliente eliminado exitosamente')
    showConfirmDelete.value = false
  } catch (error) {
    showNotificationMessage('Error al eliminar el cliente', 'error')
  }
}

// Seleccionar cliente y volver al simulador
const seleccionarCliente = (cliente) => {
  clientesStore.setClienteSeleccionado(cliente)
  router.push('/simulador')
}
</script>
