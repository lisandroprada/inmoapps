<script setup>
import { defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { 
  HomeIcon, 
  CalculatorIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  ClockIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const props = defineProps({
  isDarkMode: Boolean
})
const emit = defineEmits(['toggle-dark-mode'])

const menuItems = [
  { name: 'Inicio', route: '/', icon: HomeIcon },
  { name: 'Simulador', route: '/simulador', icon: CalculatorIcon },
  { name: 'Definición UVA', route: '/definicion', icon: DocumentTextIcon },
  { name: 'Gráficos', route: '/graficos', icon: ChartBarIcon },
  { name: 'Historial', route: '/historial', icon: ClockIcon }
]
</script>

<template>
  <nav class="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <CalculatorIcon class="h-8 w-8 text-uva-primary-600 dark:text-uva-primary-300" />
        <h1 class="text-xl font-bold text-uva-primary-600 dark:text-uva-primary-300">
          Simulador Créditos UVA
        </h1>
      </div>
      
      <div class="hidden md:flex space-x-6">
        <router-link 
          v-for="item in menuItems" 
          :key="item.route"
          :to="item.route"
          class="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-uva-primary-600 dark:hover:text-uva-primary-300 transition-colors"
        >
          <component :is="item.icon" class="h-5 w-5" />
          <span>{{ item.name }}</span>
        </router-link>
      </div>
      
      <div class="flex items-center space-x-4">
        <button 
          @click="emit('toggle-dark-mode')"
          class="dark-mode-toggle p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
        >
          <SunIcon v-if="isDarkMode" class="h-6 w-6" />
          <MoonIcon v-else class="h-6 w-6" />
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.router-link-active {
  @apply text-uva-primary-600 dark:text-uva-primary-300 font-semibold;
}
</style>
