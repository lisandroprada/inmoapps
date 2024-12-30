<script setup lang="ts">
import { ref, computed } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import html2pdf from 'html2pdf.js';
import { CurrencyDollarIcon, BuildingOfficeIcon, UserIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/vue/24/outline';
import QRCode from 'qrcode.vue';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Estado del formulario
const loanAmount = ref(10000000);
const loanTerm = ref(24); // 24 meses
const interestRate = ref(8.5);
const inflationRate = ref(12.5);
const uvaInitialValue = ref(420);

// Datos del cliente
const clientName = ref('');
const clientDNI = ref('');
const clientEmail = ref('');
const clientPhone = ref('');

// Datos de la propiedad
const propertyAddress = ref('');
const propertyType = ref('');
const propertyValue = ref(0);

// Datos del corredor
const brokerName = ref('');
const brokerLicense = ref('');
const brokerPhone = ref('');
const brokerEmail = ref('');

// URL para QR
const simulationUrl = window.location.href;

// Cálculos
const monthlyPayment = computed(() => {
  const monthlyRate = interestRate.value / 1200;
  const term = loanTerm.value;
  return (loanAmount.value * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
});

const uvaPayment = computed(() => {
  return monthlyPayment.value / uvaInitialValue.value;
});

// Generar datos para el gráfico
const generateProjection = () => {
  const labels = [];
  const pesosValues = [];
  const uvaValues = [];
  let currentPesos = monthlyPayment.value;
  let currentUVA = uvaPayment.value;

  for (let month = 0; month <= loanTerm.value; month += 4) {
    labels.push('Mes ' + month);
    pesosValues.push(currentPesos);
    uvaValues.push(currentUVA * uvaInitialValue.value);
    
    // Ajustar por inflación cuatrimestral
    currentPesos *= Math.pow(1 + (inflationRate.value / 100) / 3, 1);
  }

  return {
    labels,
    pesosValues,
    uvaValues
  };
};

const chartData = computed(() => {
  const projection = generateProjection();
  return {
    labels: projection.labels,
    datasets: [
      {
        label: 'Cuota en Pesos',
        borderColor: '#0891b2',
        backgroundColor: '#0891b220',
        fill: true,
        data: projection.pesosValues
      },
      {
        label: 'Cuota ajustada UVA',
        borderColor: '#0d9488',
        backgroundColor: '#0d948820',
        fill: true,
        data: projection.uvaValues
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Proyección de Cuotas'
    }
  }
};

// Exportar a PDF
const exportToPDF = () => {
  const element = document.getElementById('report-content');
  const opt = {
    margin: [0.5, 0.5],
    filename: 'simulacion-hipotecaria.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  html2pdf().set(opt).from(element).save();
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div id="report-content" class="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden print:shadow-none">
      <!-- Primera página -->
      <div class="page-break">
        <!-- Encabezado -->
        <div class="bg-gradient-to-r from-cyan-600 to-teal-600 text-white p-8">
          <div class="flex justify-between items-start w-full">
            <div class="flex-grow">
              <h1 class="text-3xl font-bold mb-2">Simulación de Crédito Hipotecario</h1>
              <p class="text-sm opacity-90">Fecha: {{ new Date().toLocaleDateString() }}</p>
            </div>
            <div class="flex-shrink-0 ml-4">
              <QRCode :value="simulationUrl" :size="100" level="H" class="bg-white p-2 rounded-lg" />
            </div>
          </div>
        </div>

        <!-- Datos principales -->
        <div class="p-6 grid grid-cols-2 gap-6">
          <!-- Datos del cliente -->
          <div class="space-y-4">
            <h2 class="text-lg font-semibold flex items-center text-gray-700">
              <UserIcon class="h-5 w-5 mr-2 text-cyan-600" />
              Datos del Cliente
            </h2>
            <div class="space-y-3">
              <input v-model="clientName" placeholder="Nombre completo" class="w-full p-2 border rounded-lg">
              <input v-model="clientDNI" placeholder="DNI" class="w-full p-2 border rounded-lg">
              <input v-model="clientEmail" placeholder="Email" class="w-full p-2 border rounded-lg">
              <input v-model="clientPhone" placeholder="Teléfono" class="w-full p-2 border rounded-lg">
            </div>
          </div>

          <!-- Datos de la propiedad -->
          <div class="space-y-4">
            <h2 class="text-lg font-semibold flex items-center text-gray-700">
              <BuildingOfficeIcon class="h-5 w-5 mr-2 text-cyan-600" />
              Datos de la Propiedad
            </h2>
            <div class="space-y-3">
              <input v-model="propertyAddress" placeholder="Dirección" class="w-full p-2 border rounded-lg">
              <input v-model="propertyType" placeholder="Tipo de propiedad" class="w-full p-2 border rounded-lg">
              <input v-model="propertyValue" type="number" placeholder="Valor" class="w-full p-2 border rounded-lg">
            </div>
          </div>
        </div>

        <!-- Datos del préstamo -->
        <div class="px-6 pb-6">
          <div class="bg-slate-50 p-6 rounded-xl">
            <h2 class="text-lg font-semibold flex items-center mb-4 text-gray-700">
              <CurrencyDollarIcon class="h-5 w-5 mr-2 text-cyan-600" />
              Detalles del Préstamo
            </h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Monto del préstamo</label>
                <input v-model="loanAmount" type="number" class="w-full p-2 border rounded-lg">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Plazo (meses)</label>
                <input v-model="loanTerm" type="number" class="w-full p-2 border rounded-lg">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Tasa de interés (%)</label>
                <input v-model="interestRate" type="number" step="0.1" class="w-full p-2 border rounded-lg">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Inflación estimada (%)</label>
                <input v-model="inflationRate" type="number" step="0.1" class="w-full p-2 border rounded-lg">
              </div>
            </div>
          </div>
        </div>

        <!-- Resultados -->
        <div class="px-6 pb-6">
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-xl border border-cyan-200">
              <h3 class="font-semibold text-cyan-700 mb-1">Cuota Mensual</h3>
              <p class="text-2xl font-bold text-cyan-900">$ {{ monthlyPayment.toFixed(2) }}</p>
            </div>
            <div class="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-xl border border-teal-200">
              <h3 class="font-semibold text-teal-700 mb-1">Cuota en UVA</h3>
              <p class="text-2xl font-bold text-teal-900">UVA {{ uvaPayment.toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <!-- Datos del corredor -->
        <div class="px-6 pb-6">
          <div class="bg-slate-50 p-6 rounded-xl">
            <h2 class="text-lg font-semibold flex items-center mb-4 text-gray-700">
              <UserIcon class="h-5 w-5 mr-2 text-cyan-600" />
              Datos del Corredor Inmobiliario
            </h2>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex items-center">
                <input v-model="brokerName" placeholder="Nombre del corredor" class="w-full p-2 border rounded-lg">
              </div>
              <div class="flex items-center">
                <input v-model="brokerLicense" placeholder="Matrícula" class="w-full p-2 border rounded-lg">
              </div>
              <div class="flex items-center">
                <PhoneIcon class="h-5 w-5 mr-2 text-gray-400" />
                <input v-model="brokerPhone" placeholder="Teléfono" class="w-full p-2 border rounded-lg">
              </div>
              <div class="flex items-center">
                <EnvelopeIcon class="h-5 w-5 mr-2 text-gray-400" />
                <input v-model="brokerEmail" placeholder="Email" class="w-full p-2 border rounded-lg">
              </div>
            </div>
          </div>
        </div>

        <div class="text-right text-xs text-gray-400 mt-2 px-6">
          Página 1 de 2
        </div>
      </div>

      <!-- Segunda página -->
      <div class="page-break">
        <!-- Gráfico -->
        <div class="p-6">
          <div class="bg-white rounded-xl">
            <div class="h-[250px]">
              <Line :data="chartData" :options="chartOptions" />
            </div>
          </div>
        </div>

        <!-- Tabla de proyección -->
        <div class="px-6 pb-6">
          <div class="bg-white rounded-xl overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Período</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Cuota en Pesos</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Cuota en UVA</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(label, index) in generateProjection().labels.slice(0, 6)" :key="index">
                  <td class="px-4 py-2 text-sm text-gray-900">{{ label }}</td>
                  <td class="px-4 py-2 text-sm text-gray-900">$ {{ generateProjection().pesosValues[index].toFixed(2) }}</td>
                  <td class="px-4 py-2 text-sm text-gray-900">UVA {{ (generateProjection().uvaValues[index] / uvaInitialValue).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="text-right text-xs text-gray-400 mt-2 px-6">
          Página 2 de 2
        </div>
      </div>
    </div>

    <!-- Botón de exportar -->
    <div class="max-w-4xl mx-auto mt-6 text-right print:hidden">
      <button @click="exportToPDF" class="bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-6 py-2.5 rounded-lg">
        Exportar a PDF
      </button>
    </div>
  </div>
</template>

<style scoped>
#report-content {
  width: 210mm;
  margin: 0 auto;
  background: white;
}

.page-break {
  min-height: 297mm;
  box-sizing: border-box;
  padding: 20mm;
  page-break-after: always;
}

@media print {
  body {
    margin: 0;
    padding: 0;
    background: white !important;
  }

  #report-content {
    width: 210mm;
    margin: 0;
    padding: 0;
    box-shadow: none;
  }

  .page-break {
    margin: 0;
    /* padding: 20mm; */
    page-break-after: always;
  }

  .print\:hidden {
    display: none !important;
  }

  table {
    page-break-inside: avoid;
  }

  tr {
    page-break-inside: avoid;
  }

  .bg-gradient-to-r {
    background: white !important;
    color: #333 !important;
  }
}

@page {
  size: A4;
  margin: 0;
}
</style>