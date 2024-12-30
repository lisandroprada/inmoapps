<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
      Configuración
    </h1>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <!-- Tabs -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="flex -mb-px">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-6 py-3 border-b-2 font-medium text-sm',
              activeTab === tab.id
                ? 'border-uva-primary-500 text-uva-primary-600 dark:text-uva-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="p-6">
        <!-- Datos del Usuario -->
        <div v-if="activeTab === 'usuario'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre del Corredor/Inmobiliaria
              </label>
              <input
                v-model="userConfig.nombreCorredor"
                type="text"
                class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Matrícula
              </label>
              <input
                v-model="userConfig.matricula"
                type="text"
                class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
              >
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Logo de la Inmobiliaria
              </label>
              <div class="flex items-center space-x-4">
                <img
                  v-if="userConfig.logo"
                  :src="userConfig.logo"
                  alt="Logo"
                  class="h-20 w-20 object-contain"
                >
                <input
                  type="file"
                  @change="handleLogoUpload"
                  accept="image/*"
                  class="w-full"
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Parámetros Financieros -->
        <div v-if="activeTab === 'financiero'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tasa de Interés Base (%)
              </label>
              <input
                v-model.number="financialConfig.tasaBase"
                type="number"
                step="0.1"
                class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tasa de Interés Cliente (%)
              </label>
              <input
                v-model.number="financialConfig.tasaCliente"
                type="number"
                step="0.1"
                class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Plazo Máximo (meses)
              </label>
              <input
                v-model.number="financialConfig.plazoMaximo"
                type="number"
                class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Monto Máximo (ARS)
              </label>
              <input
                v-model.number="financialConfig.montoMaximo"
                type="number"
                class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
              >
            </div>
          </div>
        </div>

        <!-- Preferencias -->
        <div v-if="activeTab === 'preferencias'" class="space-y-6">
          <div class="grid grid-cols-1 gap-6">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Modo Oscuro
              </span>
              <button
                @click="toggleDarkMode"
                class="relative inline-flex h-6 w-11 items-center rounded-full"
                :class="[
                  configStore.isDarkMode
                    ? 'bg-uva-primary-600'
                    : 'bg-gray-200'
                ]"
              >
                <span
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                  :class="[
                    configStore.isDarkMode
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  ]"
                ></span>
              </button>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Idioma
              </label>
              <select
                v-model="preferencesConfig.language"
                class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-b-lg flex justify-end space-x-4">
        <button
          @click="guardarConfiguracion"
          class="px-4 py-2 bg-uva-primary-600 text-white rounded-lg hover:bg-uva-primary-700 transition-colors"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useConfigStore } from '@/stores/config'

const configStore = useConfigStore()

const activeTab = ref('usuario')
const tabs = [
  { id: 'usuario', name: 'Datos del Usuario' },
  { id: 'financiero', name: 'Parámetros Financieros' },
  { id: 'preferencias', name: 'Preferencias' }
]

// Configuración del usuario
const userConfig = ref({
  nombreCorredor: '',
  matricula: '',
  logo: null
})

// Configuración financiera
const financialConfig = ref({
  tasaBase: 0,
  tasaCliente: 0,
  plazoMaximo: 360,
  montoMaximo: 100000000
})

// Configuración de preferencias
const preferencesConfig = ref({
  darkMode: false,
  language: 'es'
})

// Cargar configuración al montar el componente
onMounted(async () => {
  try {
    const config = configStore.getConfig()
    if (config) {
      userConfig.value = { ...userConfig.value, ...config.user }
      financialConfig.value = { ...financialConfig.value, ...config.financial }
      preferencesConfig.value = { ...preferencesConfig.value, ...config.preferences }
    }
  } catch (error) {
    console.error('Error al cargar la configuración:', error)
  }
})

const handleLogoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      userConfig.value.logo = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const guardarConfiguracion = async () => {
  try {
    await configStore.saveConfig({
      user: userConfig.value,
      financial: financialConfig.value,
      preferences: preferencesConfig.value
    })
  } catch (error) {
    console.error('Error al guardar la configuración:', error)
  }
}

const toggleDarkMode = () => {
  configStore.toggleDarkMode()
}
</script>
