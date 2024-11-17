<script setup>
const caracteristicas = [
  {
    titulo: 'Actualización por CER',
    descripcion: 'La UVA se actualiza diariamente por el Coeficiente de Estabilización de Referencia (CER), que refleja la evolución del Índice de Precios al Consumidor (IPC).',
    icon: '📈'
  },
  {
    titulo: 'Base Legal',
    descripcion: 'Establecida por el Banco Central de la República Argentina (BCRA) mediante la Com. "A" 5945 del año 2016.',
    icon: '⚖️'
  },
  {
    titulo: 'Valor Inicial',
    descripcion: 'Se estableció en $14,05 (1 UVA = $14,05) al 31 de marzo de 2016.',
    icon: '💰'
  },
  {
    titulo: 'Aplicación',
    descripcion: 'Se utiliza principalmente en créditos hipotecarios y como unidad de cuenta para ahorros y otras operaciones financieras.',
    icon: '🏦'
  }
]

const preguntas = [
  {
    pregunta: '¿Qué es la UVA?',
    respuesta: 'La Unidad de Valor Adquisitivo (UVA) es una unidad de medida que se actualiza diariamente según la variación del CER. Se utiliza principalmente en créditos hipotecarios y permite que los préstamos se ajusten según la inflación.'
  },
  {
    pregunta: '¿Cómo se calcula el valor de la UVA?',
    respuesta: 'El valor de la UVA se actualiza diariamente multiplicando el valor del día anterior por el factor de actualización diaria del CER. Este factor refleja la variación del IPC (Índice de Precios al Consumidor).'
  },
  {
    pregunta: '¿Por qué se crearon los créditos UVA?',
    respuesta: 'Los créditos UVA fueron creados para facilitar el acceso al crédito hipotecario en un contexto inflacionario, permitiendo cuotas iniciales más bajas que los créditos tradicionales, ya que tanto la cuota como el capital se ajustan por inflación.'
  },
  {
    pregunta: '¿Cuáles son los riesgos de un crédito UVA?',
    respuesta: 'El principal riesgo es que, en períodos de alta inflación, las cuotas pueden aumentar significativamente, pudiendo superar el incremento de los salarios. Esto puede dificultar el pago de las cuotas para algunos deudores.'
  }
]
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Sección de Introducción -->
    <section class="mb-12">
      <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        ¿Qué es la UVA?
      </h1>
      <div class="card">
        <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          La Unidad de Valor Adquisitivo (UVA) es una medida creada por el Banco Central de la 
          República Argentina que se actualiza diariamente según el Coeficiente de Estabilización 
          de Referencia (CER), el cual refleja el índice de inflación. Esta unidad se utiliza 
          principalmente en créditos hipotecarios y permite que los préstamos se ajusten según 
          la variación del poder adquisitivo de la moneda.
        </p>
      </div>
    </section>

    <!-- Características Principales -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Características Principales
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="item in caracteristicas" 
          :key="item.titulo"
          class="card"
        >
          <div class="flex items-start space-x-4">
            <div class="text-4xl">{{ item.icon }}</div>
            <div>
              <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {{ item.titulo }}
              </h3>
              <p class="text-gray-700 dark:text-gray-300">
                {{ item.descripcion }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Preguntas Frecuentes -->
    <section>
      <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Preguntas Frecuentes
      </h2>
      <div class="space-y-4">
        <div 
          v-for="item in preguntas" 
          :key="item.pregunta"
          class="card"
        >
          <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            {{ item.pregunta }}
          </h3>
          <p class="text-gray-700 dark:text-gray-300">
            {{ item.respuesta }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
