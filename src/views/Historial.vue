<script setup>
import { ref } from 'vue'

// En una aplicación real, estos datos vendrían de una base de datos o localStorage
const simulaciones = ref([
  {
    id: 1,
    fecha: '2024-01-15',
    monto: 15000000,
    plazo: 30,
    tasa: 3.5,
    valorUVA: 200,
    cuotaInicial: 67500,
    cuotaUVA: 337.5
  },
  {
    id: 2,
    fecha: '2024-01-14',
    monto: 10000000,
    plazo: 20,
    tasa: 3.5,
    valorUVA: 200,
    cuotaInicial: 57800,
    cuotaUVA: 289
  }
])

const eliminarSimulacion = (id) => {
  simulaciones.value = simulaciones.value.filter(sim => sim.id !== id)
}

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-AR')
}

const formatearMonto = (monto) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(monto)
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
      Historial de Simulaciones
    </h1>

    <!-- Tabla de Simulaciones -->
    <div class="card overflow-x-auto">
      <table class="min-w-full">
        <thead>
          <tr class="bg-gray-50 dark:bg-gray-700">
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Fecha
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Monto
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Plazo
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Tasa
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Valor UVA
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Cuota Inicial
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Cuota UVA
            </th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr 
            v-for="simulacion in simulaciones" 
            :key="simulacion.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
              {{ formatearFecha(simulacion.fecha) }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
              {{ formatearMonto(simulacion.monto) }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
              {{ simulacion.plazo }} años
            </td>
            <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
              {{ simulacion.tasa }}%
            </td>
            <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
              ${{ simulacion.valorUVA }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
              {{ formatearMonto(simulacion.cuotaInicial) }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
              {{ simulacion.cuotaUVA.toFixed(2) }}
            </td>
            <td class="px-4 py-3 text-sm text-center">
              <button
                @click="eliminarSimulacion(simulacion.id)"
                class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300
                       transition-colors"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Mensaje cuando no hay simulaciones -->
      <div 
        v-if="simulaciones.length === 0"
        class="text-center py-8 text-gray-500 dark:text-gray-400"
      >
        No hay simulaciones guardadas
      </div>
    </div>

    <!-- Información adicional -->
    <div class="mt-8">
      <div class="card">
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Acerca del Historial
        </h2>
        <p class="text-gray-700 dark:text-gray-300">
          Aquí puedes ver todas tus simulaciones anteriores. Cada simulación incluye los 
          parámetros utilizados y los resultados principales. Puedes usar esta información 
          para comparar diferentes escenarios y tomar mejores decisiones sobre tu crédito UVA.
        </p>
      </div>
    </div>
  </div>
</template>
