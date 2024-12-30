<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 flex flex-col justify-center sm:py-12">
    <div class="relative py-3 sm:max-w-xl sm:mx-auto">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
      <div class="relative px-4 py-10 bg-white dark:bg-gray-800 shadow-lg sm:rounded-3xl sm:p-20">
        <div class="max-w-md mx-auto">
          <div class="divide-y divide-gray-200">
            <div class="py-8 text-base leading-6 space-y-4 text-gray-700 dark:text-gray-300 sm:text-lg sm:leading-7">
              <div v-if="!isAuthenticated">
                <h2 class="text-2xl font-bold mb-8 text-center text-gray-900 dark:text-white">Verificación de Simulación</h2>
                <form @submit.prevent="handleLogin" class="space-y-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Usuario</label>
                    <input 
                      type="text" 
                      v-model="username" 
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
                    <input 
                      type="password" 
                      v-model="password"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                  </div>
                  <div class="pt-4">
                    <button 
                      type="submit"
                      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Verificar
                    </button>
                  </div>
                </form>
              </div>
              <div v-else>
                <div v-if="simulacion" class="space-y-6">
                  <h2 class="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">Simulación Verificada</h2>
                  <div class="bg-green-100 border-l-4 border-green-500 p-4 mb-4">
                    <p class="text-green-700">Esta simulación es auténtica y fue generada por nuestro sistema.</p>
                  </div>
                  <div class="space-y-4">
                    <div class="border-b pb-2">
                      <p class="text-sm text-gray-600 dark:text-gray-400">ID de Simulación</p>
                      <p class="font-medium">{{ simulacion.id }}</p>
                    </div>
                    <div class="border-b pb-2">
                      <p class="text-sm text-gray-600 dark:text-gray-400">Fecha de Emisión</p>
                      <p class="font-medium">{{ simulacion.fechaEmision }}</p>
                    </div>
                    <div class="border-b pb-2">
                      <p class="text-sm text-gray-600 dark:text-gray-400">Monto Solicitado</p>
                      <p class="font-medium">$ {{ formatearNumero(simulacion.montoSolicitado) }}</p>
                    </div>
                    <div class="border-b pb-2">
                      <p class="text-sm text-gray-600 dark:text-gray-400">Plazo</p>
                      <p class="font-medium">{{ simulacion.plazoMeses }} meses</p>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center text-red-600">
                  No se encontró la simulación solicitada
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { formatearNumero } from '@/utils/formatters'

const route = useRoute()
const username = ref('')
const password = ref('')
const isAuthenticated = ref(false)
const simulacion = ref(null)

const handleLogin = () => {
  // Por ahora, autenticación básica
  if (username.value === 'admin' && password.value === 'admin') {
    isAuthenticated.value = true
    // Aquí normalmente harías una llamada a la API para obtener los detalles de la simulación
    // usando el ID que viene en la URL
    const simulacionId = route.params.id
    // Mock de datos por ahora
    simulacion.value = {
      id: simulacionId,
      fechaEmision: new Date().toLocaleDateString(),
      montoSolicitado: 1000000,
      plazoMeses: 360
    }
  } else {
    alert('Credenciales incorrectas')
  }
}
</script>
