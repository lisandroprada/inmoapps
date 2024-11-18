<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header con logo -->
      <div class="text-center mb-12">
        <img src="@/assets/img/logo.png" alt="Logo empresa" class="h-24 mx-auto mb-6">
        <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Simulador de Créditos UVA
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Herramienta profesional para la simulación y análisis de créditos UVA
        </p>
      </div>

      <!-- Características principales -->
      <div class="grid md:grid-cols-3 gap-8 mb-12">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div class="text-uva-primary-600 dark:text-uva-primary-300 mb-4">
            <CalculatorIcon class="h-12 w-12" />
          </div>
          <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            Simulación Precisa
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            Cálculos detallados basados en las últimas tasas y valores UVA del mercado.
          </p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div class="text-uva-primary-600 dark:text-uva-primary-300 mb-4">
            <ChartBarIcon class="h-12 w-12" />
          </div>
          <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            Análisis Visual
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            Gráficos interactivos para visualizar la evolución de las cuotas y proyecciones.
          </p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div class="text-uva-primary-600 dark:text-uva-primary-300 mb-4">
            <ClockIcon class="h-12 w-12" />
          </div>
          <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            Datos en Tiempo Real
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            Información actualizada de indicadores financieros y valores UVA.
          </p>
        </div>
      </div>

      <!-- Información de la empresa -->
      <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-12">
        <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Sobre Nosotros
        </h2>
        <div class="prose dark:prose-invert max-w-none">
          <p class="mb-4">
            Somos una empresa líder en el desarrollo de soluciones tecnológicas para el sector inmobiliario y financiero. 
            Nuestro compromiso es proporcionar herramientas precisas y confiables para la toma de decisiones financieras.
          </p>
          <p class="mb-4">
            El Simulador de Créditos UVA es parte de nuestra suite de productos diseñados para ayudar a 
            profesionales y usuarios finales a tomar decisiones informadas sobre financiamiento inmobiliario.
          </p>
          <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
            Nuestra Misión
          </h3>
          <p class="mb-4">
            Facilitar el acceso a información financiera clara y precisa, permitiendo a nuestros usuarios 
            tomar decisiones informadas sobre sus inversiones inmobiliarias.
          </p>
        </div>
      </div>

      <!-- Versión y tecnologías -->
      <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Información Técnica
        </h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
              Versión
            </h3>
            <ul class="space-y-2 text-gray-600 dark:text-gray-300">
              <li>Versión actual: 1.0.0</li>
              <li>Última actualización: Enero 2024</li>
              <li>Estado: Producción</li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
              Tecnologías
            </h3>
            <ul class="space-y-2 text-gray-600 dark:text-gray-300">
              <li>Vue.js 3</li>
              <li>Tailwind CSS</li>
              <li>Firebase</li>
              <li>Chart.js</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  CalculatorIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'
</script>
