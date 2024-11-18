<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6 dark:text-white">
      Historial de Simulaciones
    </h1>

    <div v-if="simulacionesStore.loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    </div>

    <div v-else-if="simulacionesStore.error" class="text-red-600 text-center py-8">
      {{ simulacionesStore.error }}
    </div>

    <div v-else-if="simulacionesStore.simulaciones.length === 0" class="text-center py-8">
      <p class="text-gray-600 dark:text-gray-400">No hay simulaciones guardadas</p>
    </div>

    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="simulacion in simulacionesOrdenadas"
        :key="simulacion.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
      >
        <div class="mb-4">
          <h3 class="text-lg font-semibold dark:text-white">
            {{ simulacion.datosCliente?.nombre || 'Cliente' }} {{ simulacion.datosCliente?.apellido || '' }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ new Date(simulacion.fechaCreacion).toLocaleDateString() }}
          </p>
        </div>

        <div class="space-y-2">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Monto solicitado</p>
            <p class="text-lg font-semibold dark:text-white">
              ${{ formatearMoneda(simulacion.parametros.montoSolicitado) }}
            </p>
          </div>

          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Plazo</p>
            <p class="dark:text-white">{{ simulacion.parametros.plazoMeses }} meses</p>
          </div>

          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Cuota inicial</p>
            <p class="dark:text-white">${{ formatearMoneda(simulacion.resultados.cuotaInicial) }}</p>
          </div>

          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Ingreso mínimo</p>
            <p class="dark:text-white">${{ formatearMoneda(simulacion.resultados.ingresoMinimo) }}</p>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t dark:border-gray-700">
          <p v-if="simulacion.datosCliente?.email" class="text-sm text-gray-600 dark:text-gray-400">
            {{ simulacion.datosCliente.email }}
          </p>
          <p v-if="simulacion.datosCliente?.telefono" class="text-sm text-gray-600 dark:text-gray-400">
            {{ simulacion.datosCliente.telefono }}
          </p>
          <p v-if="simulacion.datosCliente?.observaciones" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {{ simulacion.datosCliente.observaciones }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useSimulacionesStore } from '@/stores/simulaciones'

const simulacionesStore = useSimulacionesStore()

const simulacionesOrdenadas = computed(() => {
  return [...simulacionesStore.simulaciones].sort((a, b) => {
    return new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
  })
})

const formatearMoneda = (valor) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(valor)
}

onMounted(async () => {
  await simulacionesStore.cargarSimulaciones()
})
</script>
