<template>
  <footer class="no-print bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-6 mt-8">
    <div class="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <h3 class="font-bold text-uva-primary-600 dark:text-uva-primary-300 mb-3">
          Simulador de Créditos UVA
        </h3>
        <p class="text-sm">
          Herramienta para simulación y análisis de créditos indexados por UVA.
        </p>
      </div>
      
      <div>
        <h4 class="font-semibold mb-3">Navegación</h4>
        <ul class="space-y-2 text-sm">
          <li v-for="item in menuItems" :key="item.route">
            <router-link 
              :to="item.route" 
              class="flex items-center space-x-2 hover:text-uva-primary-600"
            >
              <component :is="item.icon" class="h-4 w-4" />
              <span>{{ item.name }}</span>
            </router-link>
          </li>
        </ul>
      </div>
      
      <div>
        <h4 class="font-semibold mb-3">Contacto</h4>
        <div class="text-sm space-y-2">
          <p class="flex items-center space-x-2">
            <EnvelopeIcon class="h-4 w-4" />
            <span>contacto@creditosuva.com</span>
          </p>
          <p class="flex items-center space-x-2">
            <PhoneIcon class="h-4 w-4" />
            <span>+54 11 1234 5678</span>
          </p>
        </div>
      </div>
    </div>
    
    <div class="text-center text-sm mt-6 border-t dark:border-gray-700 pt-4">
      {{ new Date().getFullYear() }} Simulador de Créditos UVA. 
      Todos los derechos reservados.
    </div>
  </footer>
</template>

<script setup>
import { 
  EnvelopeIcon, 
  PhoneIcon,
  HomeIcon,
  CalculatorIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'

const menuItems = [
  { name: 'Inicio', route: '/', icon: HomeIcon },
  { name: 'Simulador', route: '/simulador', icon: CalculatorIcon },
  { name: 'Definición UVA', route: '/definicion', icon: DocumentTextIcon }
]
</script>

<style scoped>
a {
  @apply transition-colors duration-300;
}
</style>
