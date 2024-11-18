<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
      Simulador de Crédito UVA
    </h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Formulario -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <form @submit.prevent="calcularPrestamo" class="space-y-6">
            <!-- Monto del préstamo -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Monto solicitado en pesos
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  ARS
                </span>
                <input
                  :value="montoFormateado"
                  @input="handleMontoInput"
                  type="text"
                  inputmode="numeric"
                  class="w-full pl-12 pr-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                >
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Equivalente a {{ montoEnUVA.toFixed(2) }} UVAs
              </p>
            </div>

            <!-- Es cliente -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ¿Es cliente del banco?
              </label>
              <div class="flex items-center space-x-4">
                <label class="inline-flex items-center">
                  <input
                    v-model="esCliente"
                    type="radio"
                    :value="true"
                    class="form-radio text-blue-500"
                  >
                  <span class="ml-2 text-gray-700 dark:text-gray-300">Sí</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    v-model="esCliente"
                    type="radio"
                    :value="false"
                    class="form-radio text-blue-500"
                  >
                  <span class="ml-2 text-gray-700 dark:text-gray-300">No</span>
                </label>
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                TNA: {{ tasaInteres }}%
              </p>
            </div>

            <!-- Plazo -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Plazo del préstamo
              </label>
              <select
                v-model="plazoMeses"
                class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="60">5 años (60 meses)</option>
                <option value="120">10 años (120 meses)</option>
                <option value="240">20 años (240 meses)</option>
              </select>
            </div>

            <!-- Valor UVA -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Valor UVA Actual
              </label>
              <div class="relative">
                <input
                  :value="valorUVAInicial"
                  type="number"
                  step="0.01"
                  class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 bg-gray-100 dark:bg-gray-800"
                  readonly
                  :disabled="true"
                >
                <div class="text-xs mt-1">
                  <div v-if="indicadoresStore.uva.loading" class="text-gray-500 dark:text-gray-400">
                    Cargando último valor UVA...
                  </div>
                  <div v-else-if="indicadoresStore.uva.error" class="text-red-500">
                    {{ indicadoresStore.uva.error }}
                  </div>
                  <div v-else class="text-gray-500 dark:text-gray-400">
                    Actualizado al {{ indicadoresStore.fechaFormateada }}
                  </div>
                </div>
              </div>
            </div>
            <!-- Inflación Estimada -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Inflación Anual Estimada
              </label>
              <div class="relative">
                <input
                  v-model.number="inflacionEstimada"
                  type="number"
                  min="0"
                  max="500"
                  step="1"
                  class="w-full pl-12 pr-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                >
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  %
                </span>
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Inflación mensual equivalente: {{ (inflacionMensual * 100).toFixed(2) }}%
              </p>
            </div>

            <div class="mt-8">
              <h3 class="text-lg font-semibold mb-4 dark:text-white">Datos del Solicitante</h3>
              <div class="space-y-4">
                <div v-if="clientesStore.clienteSeleccionado">
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Cliente seleccionado: {{ clientesStore.clienteSeleccionado.nombre }} {{ clientesStore.clienteSeleccionado.apellido }}
                  </p>
                  <button @click="cambiarCliente" class="text-sm text-blue-500 hover:text-blue-700 transition-colors">
                    Cambiar cliente
                  </button>
                </div>
                <div v-else>
                  <button @click="seleccionarCliente" class="text-sm text-blue-500 hover:text-blue-700 transition-colors">
                    Seleccionar cliente
                  </button>
                </div>

                <div v-if="clientesStore.clienteSeleccionado">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      v-model="clientesStore.clienteSeleccionado.email"
                      type="email"
                      class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Teléfono
                    </label>
                    <input
                      v-model="clientesStore.clienteSeleccionado.telefono"
                      type="tel"
                      class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Observaciones
                    </label>
                    <textarea
                      v-model="clientesStore.clienteSeleccionado.observaciones"
                      rows="3"
                      class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                    ></textarea>
                  </div>
                </div>

                <div v-else>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nombre
                    </label>
                    <input
                      v-model="datosCliente.nombre"
                      type="text"
                      required
                      class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Apellido
                    </label>
                    <input
                      v-model="datosCliente.apellido"
                      type="text"
                      required
                      class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      v-model="datosCliente.email"
                      type="email"
                      required
                      class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Teléfono
                    </label>
                    <input
                      v-model="datosCliente.telefono"
                      type="tel"
                      class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Observaciones
                    </label>
                    <textarea
                      v-model="datosCliente.observaciones"
                      rows="3"
                      class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                    ></textarea>
                  </div>
                </div>

                <div v-if="authStore.user" class="mt-4">
                  <button
                    @click="guardarSimulacion"
                    class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    :disabled="simulacionesStore.loading"
                  >
                    {{ simulacionesStore.loading ? 'Guardando...' : 'Guardar Simulación' }}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Resultados -->
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
            Resultados del Préstamo
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <!-- Monto otorgado -->
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Monto otorgado
              </h3>
              <div class="mt-1">
                <div class="text-2xl font-bold text-gray-900 dark:text-white">
                  ${{ formatearMoneda(montoSolicitado) }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ montoEnUVA.toFixed(2) }} UVAs
                </div>
              </div>
            </div>

            <!-- Cuota -->
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Cuota inicial
              </h3>
              <div class="mt-1">
                <div class="text-2xl font-bold text-gray-900 dark:text-white">
                  ${{ formatearMoneda(cuotaPesos) }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ cuotaUVA.toFixed(2) }} UVAs
                </div>
              </div>
            </div>

            <!-- Ingreso mínimo -->
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Ingreso mínimo requerido
              </h3>
              <div class="mt-1">
                <div class="text-2xl font-bold text-gray-900 dark:text-white">
                  ${{ formatearMoneda(ingresoMinimo) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Gráfico de proyección -->
          <div class="h-80">
            <Line
              v-if="chartData"
              :data="chartData"
              :options="chartOptions"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-if="showNotification" class="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg" :class="{'bg-red-500': notificationType === 'error'}">
      {{ notificationMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { useIndicadoresStore } from '@/stores/indicadores'
import { useSimulacionesStore } from '@/stores/simulaciones'
import { useAuthStore } from '@/stores/auth'
import { useClientesStore } from '@/stores/clientes'
import { useRouter } from 'vue-router'

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// Stores y router
const router = useRouter()
const indicadoresStore = useIndicadoresStore()
const simulacionesStore = useSimulacionesStore()
const clientesStore = useClientesStore()
const authStore = useAuthStore()

// Estado del formulario y notificaciones
const montoSolicitado = ref(50000000)
const plazoMeses = ref(240)
const esCliente = ref(true)
const valorUVAInicial = ref(0)
const inflacionEstimada = ref(140)
const chartData = ref(null)
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref('success') // 'success' o 'error'

// Datos del solicitante
const datosCliente = ref({
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  observaciones: ''
})

// Funciones de navegación
const seleccionarCliente = () => {
  router.push('/clientes')
}

const cambiarCliente = () => {
  clientesStore.setClienteSeleccionado(null)
  router.push('/clientes')
}

// Función para mostrar notificación
const showNotificationMessage = (message, type = 'success') => {
  notificationMessage.value = message
  notificationType.value = type
  showNotification.value = true
  setTimeout(() => {
    showNotification.value = false
  }, 3000)
}

// Función para guardar simulación
const guardarSimulacion = async () => {
  if (!authStore.user) {
    showNotificationMessage('Debes iniciar sesión para guardar simulaciones', 'error')
    return
  }

  if (!clientesStore.clienteSeleccionado) {
    showNotificationMessage('Debes seleccionar un cliente para guardar la simulación', 'error')
    return
  }

  try {
    const simulacion = {
      clienteId: clientesStore.clienteSeleccionado.id,
      cliente: {
        nombre: clientesStore.clienteSeleccionado.nombre,
        apellido: clientesStore.clienteSeleccionado.apellido,
        email: clientesStore.clienteSeleccionado.email
      },
      parametros: {
        montoSolicitado: montoSolicitado.value,
        plazoMeses: plazoMeses.value,
        inflacionEstimada: inflacionEstimada.value,
        valorUVAInicial: valorUVAInicial.value,
        esCliente: esCliente.value
      },
      resultados: {
        cuotaInicial: cuotaPesos.value,
        ingresoMinimo: ingresoMinimo.value,
        montoEnUVA: montoEnUVA.value
      }
    }

    await simulacionesStore.guardarSimulacion(simulacion)
    showNotificationMessage('Simulación guardada exitosamente')
  } catch (error) {
    console.error('Error al guardar:', error)
    showNotificationMessage('Error al guardar la simulación', 'error')
  }
}

// Getters computados
const inflacionMensual = computed(() => Math.pow(1 + inflacionEstimada.value / 100, 1/12) - 1)
const tasaInteres = computed(() => esCliente.value ? 3.5 : 8)
const tasaMensual = computed(() => (tasaInteres.value / 12) / 100)
const montoEnUVA = computed(() => valorUVAInicial.value ? montoSolicitado.value / valorUVAInicial.value : 0)

const cuotaUVA = computed(() => {
  if (!montoEnUVA.value || !tasaMensual.value || !plazoMeses.value) return 0
  return montoEnUVA.value * (tasaMensual.value * Math.pow(1 + tasaMensual.value, plazoMeses.value)) / (Math.pow(1 + tasaMensual.value, plazoMeses.value) - 1)
})

const cuotaPesos = computed(() => cuotaUVA.value * valorUVAInicial.value)

// Ingreso mínimo requerido (25% de la cuota)
const ingresoMinimo = computed(() => cuotaPesos.value / 0.25)

const montoFormateado = computed(() => {
  return new Intl.NumberFormat('es-AR', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(montoSolicitado.value)
})

// Manejar el input del monto
const handleMontoInput = (event) => {
  const valor = event.target.value.replace(/\./g, '')
  if (/^\d*$/.test(valor)) {
    montoSolicitado.value = Number(valor)
  }
}

// Cálculos del préstamo
const calcularPrestamo = () => {
  // Generar datos para el gráfico
  const labels = []
  const cuotasProyectadas = []
  let valorUVA = valorUVAInicial.value

  for (let i = 0; i <= 24; i++) {
    labels.push(`Mes ${i}`)
    cuotasProyectadas.push(cuotaUVA.value * valorUVA)
    valorUVA *= (1 + inflacionMensual.value)
  }

  chartData.value = {
    labels,
    datasets: [{
      label: 'Cuota Proyectada (ARS)',
      data: cuotasProyectadas,
      borderColor: 'rgb(59, 130, 246)',
      tension: 0.1,
      fill: true
    }]
  }
}

// Configuración del gráfico
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top'
    },
    tooltip: {
      callbacks: {
        label: (context) => `$${new Intl.NumberFormat('es-AR', {
          style: 'decimal',
          maximumFractionDigits: 0
        }).format(context.parsed.y)}`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => `$${new Intl.NumberFormat('es-AR', {
          style: 'decimal',
          maximumFractionDigits: 0
        }).format(value)}`
      }
    }
  }
}

// Funciones auxiliares
const formatearMoneda = (valor) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(valor)
}

const parsearMoneda = (valor) => {
  return Number(valor.replace(/\./g, ''))
}

// Watcher para recalcular cuando cambian los inputs
watch([montoSolicitado, plazoMeses, inflacionEstimada], () => {
  calcularPrestamo()
}, { immediate: true })

// Cargar datos iniciales
onMounted(async () => {
  await indicadoresStore.fetchAllData()
  if (!indicadoresStore.uva.error && indicadoresStore.uva.datos.length > 0) {
    valorUVAInicial.value = indicadoresStore.uva.datos[indicadoresStore.uva.datos.length - 1].valor
  }
  calcularPrestamo()
})
</script>
