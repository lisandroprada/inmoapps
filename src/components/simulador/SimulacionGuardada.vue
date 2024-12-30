<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
      <div class="flex justify-between items-start mb-6">
        <h2 class="text-xl font-bold dark:text-white">Simulación Guardada</h2>
        <button 
          @click="$emit('close')" 
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Contenido para PDF -->
      <div ref="pdfContent" class="space-y-6">
        <!-- Información del Cliente -->
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 class="text-lg font-semibold mb-2 dark:text-white">Información del Cliente</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-300">Nombre:</p>
              <p class="font-medium dark:text-white">{{ cliente.nombre }} {{ cliente.apellido }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-300">Email:</p>
              <p class="font-medium dark:text-white">{{ cliente.email }}</p>
            </div>
            <div v-if="cliente.telefono">
              <p class="text-sm text-gray-600 dark:text-gray-300">Teléfono:</p>
              <p class="font-medium dark:text-white">{{ cliente.telefono }}</p>
            </div>
          </div>
        </div>

        <!-- Detalles de la Simulación -->
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 class="text-lg font-semibold mb-2 dark:text-white">Detalles del Préstamo</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-300">Monto Solicitado:</p>
              <p class="font-medium dark:text-white">{{ formatearMoneda(simulacion.montoSolicitado) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-300">Plazo:</p>
              <p class="font-medium dark:text-white">{{ simulacion.plazoMeses }} meses</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-300">Tasa de Interés:</p>
              <p class="font-medium dark:text-white">{{ simulacion.tasaInteres }}% TNA</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-300">Cuota Inicial:</p>
              <p class="font-medium dark:text-white">{{ formatearMoneda(simulacion.cuotaInicial) }}</p>
            </div>
          </div>
        </div>

        <!-- Gráfico -->
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 class="text-lg font-semibold mb-2 dark:text-white">Evolución de la Cuota</h3>
          <div class="w-full h-64">
            <Line
              :data="chartData"
              :options="chartOptions"
              style="width: 100%; height: 100%;"
            />
          </div>
        </div>
      </div>

      <!-- Botones de Acción -->
      <div class="mt-6 flex justify-end space-x-4">
        <button
          @click="generarPDF"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Descargar PDF
        </button>
        <button
          @click="$emit('close')"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Line } from 'vue-chartjs'
import html2pdf from 'html2pdf.js'

const props = defineProps({
  cliente: {
    type: Object,
    required: true
  },
  simulacion: {
    type: Object,
    required: true
  },
  chartData: {
    type: Object,
    required: true
  },
  chartOptions: {
    type: Object,
    required: true
  }
})

const pdfContent = ref(null)

const formatearMoneda = (valor) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(valor)
}

const generarPDF = async () => {
  const element = pdfContent.value
  const opt = {
    margin: 1,
    filename: `simulacion-uva-${props.cliente.apellido}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  }

  try {
    await html2pdf().set(opt).from(element).save()
  } catch (error) {
    console.error('Error al generar el PDF:', error)
  }
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => formatearMoneda(value)
      }
    }
  },
  plugins: {
    legend: {
      display: true,
      position: 'top'
    }
  }
}

defineEmits(['close'])
</script>
