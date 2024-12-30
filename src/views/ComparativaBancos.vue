<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-6">Comparativa de Bancos</h1>
    
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <thead>
          <tr class="bg-gray-100 dark:bg-gray-700">
            <th class="sticky left-0 bg-gray-100 dark:bg-gray-700 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider z-[10]">Banco</th>
            <th v-for="header in tableHeaders" :key="header" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="(bank, bankName) in banksData" :key="bankName" class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="sticky left-0 bg-white dark:bg-gray-800 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white z-[10]">
              {{ bankName }}
            </td>
            <td v-for="header in tableHeaders" :key="header" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {{ bank[header] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Leyenda -->
    <div class="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Notas importantes:</h3>
      <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
        <li>Los datos presentados son referenciales y pueden variar según cada caso particular.</li>
        <li>Las tasas y condiciones están sujetas a cambios por parte de las entidades bancarias.</li>
        <li>(*) Prima de seguro: Algunos bancos pueden requerir seguros adicionales.</li>
        <li>Consulte directamente con el banco para obtener información actualizada y específica para su caso.</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const banksData = {
  "Hipotecario": {
    "Plazo": "Hasta 30 años",
    "Monto Prestable": "250 Mio (USD) / 235 k (aprox)",
    "Financiación de la propiedad": "80%",
    "Relación Cuota-Ingreso": "Sin límite",
    "Tasa (Cobrando sueldo)": "4.25% + 0.5% Resto",
    "Tasa (sin cobrar sueldo)": "5.5% + Microcomisión 5.5% Resto",
    "Ingresos Mínimos": "1.6 Mio - Si como 100.8.2 Mio / 1.4 Mio - Si como 100 8.2 Mio",
    "Pre Cancelación": "3% + IVA",
    "Prima de Seguro": "No",
    "Destino de los fondos": "Vivienda, refacción o ampliación"
  },
  "Ciudad": {
    "Plazo": "Hasta 20 años",
    "Monto Prestable": "Sin límite",
    "Financiación de la propiedad": "80%",
    "Relación Cuota-Ingreso": "Sin límite",
    "Tasa (Cobrando sueldo)": "4% (Ier Año) - 5% Resto",
    "Tasa (sin cobrar sueldo)": "8% (no hace falta ser cliente)",
    "Ingresos Mínimos": "850k",
    "Pre Cancelación": "4% + IVA",
    "Prima de Seguro": "No",
    "Destino de los fondos": "Vivienda, refacción o ampliación"
  },
  "Supervielle": {
    "Plazo": "Hasta 15 años",
    "Monto Prestable": "250 Mio (USD) / 235 k (aprox)",
    "Financiación de la propiedad": "75%",
    "Relación Cuota-Ingreso": "25%",
    "Tasa (Cobrando sueldo)": "5.0%",
    "Tasa (sin cobrar sueldo)": "7.5%",
    "Ingresos Mínimos": "850k",
    "Pre Cancelación": "Sin Información",
    "Prima de Seguro": "No",
    "Destino de los fondos": "Vivienda, refacción o ampliación"
  },
  "ICBC": {
    "Plazo": "Hasta 20 años",
    "Monto Prestable": "100.000 U$A / (USD 30.000 aprox)",
    "Financiación de la propiedad": "100%",
    "Relación Cuota-Ingreso": "Sin Información",
    "Tasa (Cobrando sueldo)": "4.9%",
    "Tasa (sin cobrar sueldo)": "4.9%",
    "Ingresos Mínimos": "3702k soltero, 3837k con conyugue",
    "Pre Cancelación": "Sin Información",
    "Prima de Seguro": "No",
    "Destino de los fondos": "Vivienda, refacción o ampliación"
  },
  "BANCOR": {
    "Plazo": "Hasta 20 años",
    "Monto Prestable": "105.000 U$A / (USD 30.000 aprox)",
    "Financiación de la propiedad": "80%",
    "Relación Cuota-Ingreso": "Sin límite",
    "Tasa (Cobrando sueldo)": "5.0%",
    "Tasa (sin cobrar sueldo)": "No",
    "Ingresos Mínimos": "Sin Información",
    "Pre Cancelación": "Sin Información",
    "Prima de Seguro": "No",
    "Destino de los fondos": "Vivienda, refacción o ampliación"
  },
  "Banco de Corrientes": {
    "Plazo": "Hasta 30 años",
    "Monto Prestable": "165.000 U$A / (USD 50.000 aprox)",
    "Financiación de la propiedad": "75%",
    "Relación Cuota-Ingreso": "Sin límite",
    "Tasa (Cobrando sueldo)": "4.50%",
    "Tasa (sin cobrar sueldo)": "8%",
    "Ingresos Mínimos": "Sin Información",
    "Pre Cancelación": "4% + IVA",
    "Prima de Seguro": "1.5% (*)",
    "Destino de los fondos": "Vivienda, refacción o ampliación"
  },
  "Nación": {
    "Plazo": "Hasta 20 años",
    "Monto Prestable": "Sin límite",
    "Financiación de la propiedad": "75% 1er / 50% 2da",
    "Relación Cuota-Ingreso": "25%",
    "Tasa (Cobrando sueldo)": "5.50%",
    "Tasa (sin cobrar sueldo)": "-",
    "Ingresos Mínimos": "850k",
    "Pre Cancelación": "3% + IVA",
    "Prima de Seguro": "No",
    "Destino de los fondos": "Vivienda, refacción o ampliación"
  },
  "Santander": {
    "Plazo": "Hasta 20 años",
    "Monto Prestable": "Sin límite",
    "Financiación de la propiedad": "80% ler y 60% 2da ",
    "Relación Cuota-Ingreso": "Sin límite",
    "Tasa (Cobrando sueldo)": "5.50%",
    "Tasa (sin cobrar sueldo)": "7%",
    "Ingresos Mínimos": "Sin Información",
    "Pre Cancelación": "3% + IVA",
    "Prima de Seguro": "No",
    "Destino de los fondos": "Vivienda, refacción o ampliación"
  },
  "Macro": {
    "Plazo": "Hasta 20 años",
    "Monto Prestable": "78k / 80x (80% ler y 50% 2da)",
    "Financiación de la propiedad": "80%",
    "Relación Cuota-Ingreso": "Sin límite",
    "Tasa (Cobrando sueldo)": "6.50%",
    "Tasa (sin cobrar sueldo)": "9.5%",
    "Ingresos Mínimos": "Sin Información",
    "Pre Cancelación": "3% + IVA",
    "Prima de Seguro": "No",
    "Destino de los fondos": "Vivienda, refacción o ampliación"
  },
  "BBVA": {
    "Plazo": "Hasta 20 años",
    "Monto Prestable": "Sin límite",
    "Financiación de la propiedad": "80%",
    "Relación Cuota-Ingreso": "25%",
    "Tasa (Cobrando sueldo)": "5.50%",
    "Tasa (sin cobrar sueldo)": "7.5%",
    "Ingresos Mínimos": "850k",
    "Pre Cancelación": "GRATIS",
    "Prima de Seguro": "No",
    "Destino de los fondos": "Vivienda, refacción o ampliación"
  },
  "Galicia": {
    "Plazo": "Hasta 30 años",
    "Monto Prestable": "Sin límite",
    "Financiación de la propiedad": "80%",
    "Relación Cuota-Ingreso": "35%",
    "Tasa (Cobrando sueldo)": "3.50%",
    "Tasa (sin cobrar sueldo)": "4.5%",
    "Ingresos Mínimos": "890k comprá",
    "Pre Cancelación": "-",
    "Prima de Seguro": "No",
    "Destino de los fondos": "Vivienda, refacción o ampliación"
  },
  "Banco de Neuquén": {
    "Plazo": "Hasta 30 años",
    "Monto Prestable": "Sin límite",
    "Financiación de la propiedad": "80%",
    "Relación Cuota-Ingreso": "Sin límite",
    "Tasa (Cobrando sueldo)": "5.50%",
    "Tasa (sin cobrar sueldo)": "7.5%",
    "Ingresos Mínimos": "Sin Información",
    "Pre Cancelación": "-",
    "Prima de Seguro": "No",
    "Destino de los fondos": "Vivienda, refacción o ampliación"
  }
}

const tableHeaders = [
  "Plazo",
  "Monto Prestable",
  "Financiación de la propiedad",
  "Relación Cuota-Ingreso",
  "Tasa (Cobrando sueldo)",
  "Tasa (sin cobrar sueldo)",
  "Ingresos Mínimos",
  "Pre Cancelación",
  "Prima de Seguro",
  "Destino de los fondos"
]
</script>

<style scoped>
.overflow-x-auto {
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

table {
  border-collapse: separate;
  border-spacing: 0;
}

th, td {
  border-bottom: 1px solid #e2e8f0;
}

.dark th, .dark td {
  border-bottom: 1px solid #374151;
}

tr:last-child td {
  border-bottom: none;
}
</style>
