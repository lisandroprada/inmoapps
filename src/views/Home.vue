<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const features = [
  {
    title: 'Simulador de Créditos UVA',
    description: 'Calcula cuotas, intereses y proyecciones para tu crédito UVA.',
    icon: '💰',
    route: '/simulador'
  },
  {
    title: 'Gráficos Interactivos',
    description: 'Visualiza la evolución de UVA, IPC y más indicadores.',
    icon: '📊',
    route: '/graficos'
  },
  {
    title: 'Historial de Simulaciones',
    description: 'Guarda y compara diferentes escenarios de créditos.',
    icon: '📋',
    route: '/historial'
  }
]
</script>

<template>
  <div class="space-y-12">
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <div class="gradient-bg absolute inset-0 opacity-10"></div>
      <div class="relative container mx-auto px-4 py-16 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
          Simulador de Créditos UVA
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Analiza y simula créditos UVA con nuestra herramienta interactiva. 
          Toma decisiones informadas sobre tu crédito hipotecario.
        </p>
        <button 
          @click="router.push('/simulador')"
          class="bg-uva-primary-600 hover:bg-uva-primary-700 text-white px-8 py-3 rounded-lg 
                 shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Comenzar Simulación
        </button>
      </div>
    </section>

    <!-- Features Section -->
    <section class="container mx-auto px-4 py-12">
      <h2 class="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
        Características Principales
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="feature in features" 
          :key="feature.title"
          class="card hover:shadow-xl cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
          @click="router.push(feature.route)"
        >
          <div class="text-4xl mb-4">{{ feature.icon }}</div>
          <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            {{ feature.title }}
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-gradient-to-r from-uva-primary-600 to-uva-primary-700 text-white py-16">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-6">
          ¿Listo para analizar tu crédito UVA?
        </h2>
        <p class="text-lg mb-8 opacity-90">
          Utiliza nuestro simulador para tomar decisiones informadas sobre tu crédito hipotecario.
        </p>
        <button 
          @click="router.push('/simulador')"
          class="bg-white text-uva-primary-700 px-8 py-3 rounded-lg shadow-lg 
                 hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
        >
          Ir al Simulador
        </button>
      </div>
    </section>
  </div>
</template>
