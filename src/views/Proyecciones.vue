<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Proyección de Inflación
      </h1>
      <button
        @click="mostrarFundamentacion = !mostrarFundamentacion"
        class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {{ mostrarFundamentacion ? 'Ocultar Fundamentación' : 'Ver Fundamentación' }}
      </button>
    </div>

    <!-- Fundamentación del Modelo -->
    <div v-if="mostrarFundamentacion" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Fundamentación del Modelo
      </h2>
      <div class="prose dark:prose-invert max-w-none">
        <p class="mb-4">
          El modelo de proyección utiliza un enfoque híbrido que combina datos mensuales y anuales para capturar tanto las tendencias recientes como los patrones a largo plazo de la inflación en Argentina.
        </p>
        
        <h3 class="text-lg font-semibold mb-2">Componentes del Modelo</h3>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>
            <strong>Tendencia Mensual (60%):</strong> Analiza los últimos 3 meses para capturar la dinámica actual de precios y tendencias emergentes.
          </li>
          <li>
            <strong>Perspectiva Anual (40%):</strong> Utiliza la inflación interanual para mantener la consistencia con patrones históricos y tendencias de largo plazo.
          </li>
          <li>
            <strong>Factor de Aceleración:</strong> Incremento mensual del 2% que refleja la naturaleza acelerativa de la inflación argentina.
          </li>
        </ul>

        <h3 class="text-lg font-semibold mb-2">Justificación Técnica</h3>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>
            <strong>Ponderación Mayor a Datos Recientes:</strong> En contextos de alta inflación, los datos más recientes tienen mayor poder predictivo.
          </li>
          <li>
            <strong>Aceleración Progresiva:</strong> La historia económica argentina muestra que los procesos inflacionarios tienden a acelerarse en el tiempo.
          </li>
          <li>
            <strong>Bandas de Confianza:</strong> Margen de ±5% para reflejar la incertidumbre inherente a las proyecciones económicas.
          </li>
        </ul>

        <div class="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
          <h3 class="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">Nota Importante</h3>
          <p class="text-blue-800 dark:text-blue-200">
            Este modelo está específicamente diseñado para el contexto argentino y sus particularidades inflacionarias. Las proyecciones deben considerarse como estimaciones y actualizarse regularmente.
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Gráfico de Proyección -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 lg:col-span-2">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Tendencia y Proyección
          </h2>
          <div class="flex space-x-2">
            <button
              @click="calcularProyeccion"
              class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              :disabled="calculando"
            >
              <svg v-if="calculando" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ calculando ? 'Calculando...' : 'Calcular Proyección' }}
            </button>
            <button
              v-if="inflacionAnualProyectada"
              @click="aplicarAlSimulador"
              class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Aplicar al Simulador
            </button>
          </div>
        </div>
        
        <div class="h-96">
          <Line
            v-if="chartData.datasets.length > 0"
            :data="chartData"
            :options="chartOptions"
          />
          <div v-else class="h-full flex items-center justify-center text-gray-500">
            {{ calculando ? 'Calculando proyección...' : 'Haga clic en Calcular Proyección para comenzar' }}
          </div>
        </div>
      </div>

      <!-- Resultados -->
      <div v-if="inflacionAnualProyectada" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 lg:col-span-2">
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Resultados de la Proyección
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-blue-50 rounded-lg p-4">
            <h3 class="text-sm font-medium text-blue-800 mb-2">Inflación Anual Proyectada</h3>
            <p class="text-2xl font-bold text-blue-900">{{ inflacionAnualProyectada }}%</p>
          </div>
          <div class="bg-green-50 rounded-lg p-4">
            <h3 class="text-sm font-medium text-green-800 mb-2">Confianza de la Proyección</h3>
            <p class="text-2xl font-bold text-green-900">95%</p>
          </div>
          <div class="bg-purple-50 rounded-lg p-4">
            <h3 class="text-sm font-medium text-purple-800 mb-2">Período de Proyección</h3>
            <p class="text-2xl font-bold text-purple-900">12 meses</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { useIndicadoresStore } from '../stores/indicadores'
import { useSimuladorStore } from '../stores/simulador'
import { useRouter } from 'vue-router'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const router = useRouter()
const indicadoresStore = useIndicadoresStore()
const simuladorStore = useSimuladorStore()

const calculando = ref(false)
const proyecciones = ref([])
const inflacionAnualProyectada = ref(null)
const error = ref('')
const mostrarFundamentacion = ref(false)

const chartData = computed(() => {
  if (!proyecciones.value.length) {
    return {
      labels: [],
      datasets: []
    }
  }

  const datosReales = indicadoresStore.datosFiltrados.inflacionInteranual || []
  
  // Asegurarnos de que no haya superposición entre datos reales y proyecciones
  const ultimaFechaReal = new Date(datosReales[datosReales.length - 1].fecha)
  const proyeccionesFiltradas = proyecciones.value.filter(p => 
    new Date(p.fecha) > ultimaFechaReal
  )

  const labels = [
    ...datosReales.map(d => new Date(d.fecha).toLocaleDateString('es-AR', { month: 'short', year: 'numeric' })),
    ...proyeccionesFiltradas.map(d => new Date(d.fecha).toLocaleDateString('es-AR', { month: 'short', year: 'numeric' }))
  ]

  // Encontrar el valor mínimo y máximo para ajustar la escala
  const todosLosValores = [
    ...datosReales.map(d => Number(d.valor)),
    ...proyeccionesFiltradas.map(d => Number(d.valor)),
    ...proyeccionesFiltradas.map(d => Number(d.valor_superior)),
    ...proyeccionesFiltradas.map(d => Number(d.valor_inferior))
  ].filter(v => !isNaN(v))

  const minValue = Math.min(...todosLosValores)
  const maxValue = Math.max(...todosLosValores)

  // Ajustar chartOptions con los nuevos límites
  chartOptions.scales.y.min = Math.floor(minValue * 0.95) // 5% menos que el mínimo
  chartOptions.scales.y.max = Math.ceil(maxValue * 1.05)  // 5% más que el máximo

  return {
    labels,
    datasets: [
      {
        label: 'Inflación Interanual Real',
        data: [...datosReales.map(d => Number(d.valor))],
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F6',
        pointRadius: 2,
        borderWidth: 2,
        tension: 0.4
      },
      {
        label: 'Proyección',
        data: [
          ...Array(datosReales.length - 1).fill(null),
          Number(datosReales[datosReales.length - 1].valor),  // Punto de conexión
          ...proyeccionesFiltradas.map(d => Number(d.valor))
        ],
        borderColor: '#10B981',
        backgroundColor: '#10B981',
        pointRadius: 2,
        borderWidth: 2,
        tension: 0.4
      },
      {
        label: 'Intervalo de Confianza',
        data: [
          ...Array(datosReales.length - 1).fill(null),
          Number(datosReales[datosReales.length - 1].valor),  // Punto de conexión
          ...proyeccionesFiltradas.map(d => Number(d.valor_superior))
        ],
        borderColor: 'rgba(16, 185, 129, 0.2)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        pointRadius: 0,
        borderWidth: 1,
        fill: '+1'
      },
      {
        label: 'Intervalo de Confianza',
        data: [
          ...Array(datosReales.length - 1).fill(null),
          Number(datosReales[datosReales.length - 1].valor),  // Punto de conexión
          ...proyeccionesFiltradas.map(d => Number(d.valor_inferior))
        ],
        borderColor: 'rgba(16, 185, 129, 0.2)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        pointRadius: 0,
        borderWidth: 1,
        fill: false
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        filter: (item) => !item.text.includes('Intervalo de Confianza')
      }
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y.toFixed(1) + '%';
          }
          return label;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      ticks: {
        callback: function(value) {
          return value.toFixed(1) + '%';
        }
      },
      title: {
        display: true,
        text: 'Inflación Interanual (%)'
      }
    }
  }
}

const calcularProyeccion = async () => {
  try {
    error.value = ''
    calculando.value = true
    
    const datosInteranuales = indicadoresStore.datosFiltrados.inflacionInteranual || []
    const datosMensuales = indicadoresStore.datosFiltrados.inflacion || []
    
    console.log('Datos del store:', {
      datosMensuales,
      datosInteranuales,
      datosFiltrados: indicadoresStore.datosFiltrados
    })
    
    if (!datosInteranuales?.length) {
      throw new Error('No hay datos de inflación interanual disponibles')
    }
    
    if (!datosMensuales?.length) {
      throw new Error('No hay datos de inflación mensual disponibles')
    }

    // Formatear ambas series
    const formatearSerie = (datos) => datos.map(d => ({
      fecha: new Date(d.fecha).toISOString().split('T')[0],
      valor: Number(d.valor)
    }))

    const datosFormateados = {
      datos_mensuales: formatearSerie(datosMensuales),
      datos_interanuales: formatearSerie(datosInteranuales),
      periodos: 12
    }
    
    console.log('Datos formateados para enviar:', datosFormateados)

    const response = await fetch('http://localhost:8000/api/proyectar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosFormateados)
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error del servidor:', errorData)
      throw new Error(errorData.detail || 'Error al calcular la proyección')
    }

    const data = await response.json()
    console.log('Respuesta:', data)
    proyecciones.value = data.proyecciones
    inflacionAnualProyectada.value = data.inflacion_anual_proyectada
  } catch (e) {
    console.error('Error completo:', e)
    error.value = e.message || 'Error al conectar con el servidor'
    proyecciones.value = []
    inflacionAnualProyectada.value = null
  } finally {
    calculando.value = false
  }
}

const aplicarAlSimulador = () => {
  if (inflacionAnualProyectada.value) {
    console.log('Aplicando inflación estimada:', inflacionAnualProyectada.value)
    simuladorStore.setInflacionEstimada(inflacionAnualProyectada.value)
    console.log('Store actualizado. Valor:', simuladorStore.inflacionEstimada)
    router.push('/simulador')
  } else {
    console.error('No hay inflación proyectada para aplicar')
  }
}

onMounted(async () => {
  try {
    await indicadoresStore.fetchAllData()
  } catch (e) {
    console.error('Error al cargar datos:', e)
    error.value = 'Error al cargar los datos históricos'
  }
})
</script>