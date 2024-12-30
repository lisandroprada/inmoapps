<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
      Indicadores Financieros
    </h1>

    <!-- Selector de período -->
    <div class="mb-8">
      <div class="inline-flex rounded-lg border border-gray-200 dark:border-gray-700">
        <button
          v-for="periodo in ['6m', '12m', '5y']"
          :key="periodo"
          @click="indicadoresStore.setPeriodo(periodo)"
          :class="[
            'px-4 py-2 text-sm font-medium',
            indicadoresStore.periodoSeleccionado === periodo
              ? 'bg-blue-500 text-white'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          ]"
        >
          {{ formatearPeriodo(periodo) }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- UVA -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Evolución del Valor UVA
          </h2>
          <button
            @click="exportarAExcel('uva')"
            class="inline-flex items-center px-3 py-1 text-sm rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title="Exportar a Excel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            Excel
          </button>
        </div>
        <div v-if="indicadoresStore.uva.loading" class="flex items-center justify-center h-64">
          <div class="text-gray-500">Cargando datos...</div>
        </div>
        <div v-else-if="indicadoresStore.uva.error" class="flex items-center justify-center h-64">
          <div class="text-red-500">{{ indicadoresStore.uva.error }}</div>
        </div>
        <div v-else class="h-64">
          <Line
            :data="indicadoresStore.chartData('uva')"
            :options="getChartOptions('uva')"
          />
        </div>
      </div>

      <!-- Inflación Mensual -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Inflación Mensual
          </h2>
          <button
            @click="exportarAExcel('inflacion')"
            class="inline-flex items-center px-3 py-1 text-sm rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title="Exportar a Excel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            Excel
          </button>
        </div>
        <div v-if="indicadoresStore.inflacion.loading" class="flex items-center justify-center h-64">
          <div class="text-gray-500">Cargando datos...</div>
        </div>
        <div v-else-if="indicadoresStore.inflacion.error" class="flex items-center justify-center h-64">
          <div class="text-red-500">{{ indicadoresStore.inflacion.error }}</div>
        </div>
        <div v-else class="h-64">
          <Line
            :data="indicadoresStore.chartData('inflacion')"
            :options="getChartOptions('inflacion')"
          />
        </div>
      </div>

      <!-- Inflación Interanual -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Inflación Interanual
          </h2>
          <button
            @click="exportarAExcel('inflacionInteranual')"
            class="inline-flex items-center px-3 py-1 text-sm rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title="Exportar a Excel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            Excel
          </button>
        </div>
        <div v-if="indicadoresStore.inflacionInteranual.loading" class="flex items-center justify-center h-64">
          <div class="text-gray-500">Cargando datos...</div>
        </div>
        <div v-else-if="indicadoresStore.inflacionInteranual.error" class="flex items-center justify-center h-64">
          <div class="text-red-500">{{ indicadoresStore.inflacionInteranual.error }}</div>
        </div>
        <div v-else class="h-64">
          <Line
            :data="indicadoresStore.chartData('inflacionInteranual')"
            :options="getChartOptions('inflacionInteranual')"
          />
        </div>
      </div>

      <!-- Riesgo País -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Riesgo País
          </h2>
          <button
            @click="exportarAExcel('riesgoPais')"
            class="inline-flex items-center px-3 py-1 text-sm rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title="Exportar a Excel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            Excel
          </button>
        </div>
        <div v-if="indicadoresStore.riesgoPais.loading" class="flex items-center justify-center h-64">
          <div class="text-gray-500">Cargando datos...</div>
        </div>
        <div v-else-if="indicadoresStore.riesgoPais.error" class="flex items-center justify-center h-64">
          <div class="text-red-500">{{ indicadoresStore.riesgoPais.error }}</div>
        </div>
        <div v-else class="h-64">
          <Line
            :data="indicadoresStore.chartData('riesgoPais')"
            :options="getChartOptions('riesgoPais')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { useIndicadoresStore } from '../stores/indicadores'
import * as XLSX from 'xlsx'

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

// Store de indicadores
const indicadoresStore = useIndicadoresStore()

// Formatear texto del período
const formatearPeriodo = (periodo) => {
  switch (periodo) {
    case '6m': return '6 Meses'
    case '12m': return '12 Meses'
    case '5y': return '5 Años'
    default: return periodo
  }
}

// Opciones del gráfico según el indicador
const getChartOptions = (indicador) => {
  const configuraciones = {
    uva: {
      formato: (value) => `$${value.toFixed(2)}`
    },
    inflacion: {
      formato: (value) => `${value.toFixed(1)}%`
    },
    inflacionInteranual: {
      formato: (value) => `${value.toFixed(1)}%`
    },
    riesgoPais: {
      formato: (value) => value.toFixed(0)
    }
  }

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: 'rgb(156, 163, 175)'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || ''
            const value = configuraciones[indicador].formato(context.parsed.y)
            return `${label}: ${value}`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          callback: (value) => configuraciones[indicador].formato(value)
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  }
}

// Función para exportar a Excel
const exportarAExcel = (indicador) => {
  const datos = indicadoresStore.datosFiltrados[indicador] || []
  if (!datos.length) return

  // Preparar los datos para Excel
  const datosParaExcel = datos.map(item => ({
    Fecha: new Date(item.fecha).toLocaleDateString('es-AR'),
    Valor: item.valor
  }))

  // Crear libro de trabajo y hoja
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(datosParaExcel)

  // Agregar la hoja al libro
  XLSX.utils.book_append_sheet(wb, ws, indicador.toUpperCase())

  // Guardar el archivo
  XLSX.writeFile(wb, `${indicador}_${new Date().toISOString().split('T')[0]}.xlsx`)
}

// Cargar datos al montar el componente
onMounted(async () => {
  await indicadoresStore.fetchAllData()
})
</script>
