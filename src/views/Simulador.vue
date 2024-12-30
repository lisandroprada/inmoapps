<template>
    <div>
        <!-- Vista normal -->
        <div class="container mx-auto px-4 py-6">
            <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Simulador de Crédito UVA
            </h1>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <!-- Formulario -->
                <div class="lg:col-span-4">
                    <div
                        class="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
                    >
                        <form
                            @submit.prevent="calcularPrestamo"
                            class="space-y-4"
                        >
                            <!-- Monto del préstamo -->
                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    Monto solicitado en pesos
                                </label>
                                <div class="relative">
                                    <span
                                        class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    >
                                        ARS
                                    </span>
                                    <input
                                        :value="montoFormateado"
                                        @input="handleMontoInput"
                                        type="text"
                                        inputmode="numeric"
                                        class="w-full pl-12 pr-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                                    />
                                </div>
                                <p class="text-sm text-gray-500 mt-1">
                                    {{ montoEnUVA.toFixed(2) }} UVAs
                                </p>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <!-- Es cliente -->
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    >
                                        ¿Es cliente?
                                    </label>
                                    <div class="flex items-center space-x-4">
                                        <label class="inline-flex items-center">
                                            <input
                                                v-model="esCliente"
                                                type="radio"
                                                :value="true"
                                                class="form-radio"
                                            />
                                            <span class="ml-2 text-sm">Sí</span>
                                        </label>
                                        <label class="inline-flex items-center">
                                            <input
                                                v-model="esCliente"
                                                type="radio"
                                                :value="false"
                                                class="form-radio"
                                            />
                                            <span class="ml-2 text-sm">No</span>
                                        </label>
                                    </div>
                                    <p class="text-sm text-gray-500 mt-1">
                                        TNA: {{ tasaInteres }}% (TEM:
                                        {{ tasaMensualPorcentaje }}%)
                                    </p>
                                </div>

                                <!-- Plazo -->
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    >
                                        Plazo
                                    </label>
                                    <select
                                        v-model="simuladorStore.plazoMeses"
                                        class="w-full px-3 py-2 text-sm rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                                    >
                                        <option value="60">5 años</option>
                                        <option value="120">10 años</option>
                                        <option value="240">20 años</option>
                                        <option value="360">30 años</option>
                                    </select>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <!-- Valor UVA -->
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                    >
                                        Valor UVA
                                    </label>
                                    <input
                                        :value="valorUVAInicial.toFixed(2)"
                                        type="text"
                                        class="w-full px-3 py-2 text-sm rounded-lg border bg-gray-50"
                                        readonly
                                    />
                                    <p class="text-xs text-gray-500 mt-1">
                                        {{
                                            indicadoresStore.fechaActualizacion
                                        }}
                                    </p>
                                </div>

                                <!-- Inflación Estimada -->
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                    >
                                        Inflación Anual
                                    </label>
                                    <div class="relative">
                                        <input
                                            v-model.number="inflacionEstimada"
                                            type="number"
                                            min="0"
                                            max="500"
                                            class="w-full pl-8 pr-3 py-2 text-sm rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <span
                                            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                        >
                                            %
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Resultados -->
                            <div class="border-t pt-4 mt-4">
                                <h3
                                    class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                                >
                                    Resultados
                                </h3>
                                <div class="space-y-2">
                                    <div class="flex justify-between">
                                        <span
                                            class="text-sm text-gray-600 dark:text-gray-400"
                                            >Cuota inicial:</span
                                        >
                                        <span class="text-sm font-medium">
                                            ${{ formatearMoneda(cuotaPesos) }}
                                        </span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span
                                            class="text-sm text-gray-600 dark:text-gray-400"
                                            >Cuota en UVAs:</span
                                        >
                                        <span class="text-sm font-medium">
                                            {{ cuotaUVAs.toFixed(2) }} UVAs
                                        </span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span
                                            class="text-sm text-gray-600 dark:text-gray-400"
                                            >Total a devolver:</span
                                        >
                                        <span class="text-sm font-medium">
                                            {{ totalUVAsADevolver.toFixed(2) }}
                                            UVAs
                                        </span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span
                                            class="text-sm text-gray-600 dark:text-gray-400"
                                            >Ingreso mínimo:</span
                                        >
                                        <span class="text-sm font-medium">
                                            ${{
                                                formatearMoneda(ingresoMinimo)
                                            }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Botón para guardar la simulación -->
                            <div class="mt-4">
                                <button
                                    @click="guardarSimulacion"
                                    class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                    :disabled="simulacionesStore.loading"
                                >
                                    {{
                                        simulacionesStore.loading
                                            ? "Guardando..."
                                            : "Guardar Simulación"
                                    }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Gráfico -->
                <div class="lg:col-span-8">
                    <div
                        class="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
                    >
                        <!-- Controles del gráfico -->
                        <div class="flex justify-end space-x-2 mb-4">
                            <button
                                v-for="periodo in [
                                    { key: 'doce', label: '12 meses' },
                                    { key: 'veinticuatro', label: '24 meses' },
                                    { key: 'total', label: 'Total' },
                                ]"
                                :key="periodo.key"
                                @click="
                                    simuladorStore.setHorizonte(periodo.key)
                                "
                                :class="[
                                    'px-3 py-1 text-sm rounded-md',
                                    simuladorStore.horizonteSeleccionado ===
                                    periodo.key
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                                ]"
                            >
                                {{ periodo.label }}
                            </button>
                        </div>

                        <!-- Contenedor del gráfico -->
                        <div class="h-[400px]">
                            <Line
                                :data="simuladorStore.chartData"
                                :options="chartOptions"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { Line } from "vue-chartjs";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { useIndicadoresStore } from "../stores/indicadores";
import { useSimuladorStore } from "../stores/simulador";
import { useSimulacionesStore } from "@/stores/simulaciones";

// Registrar componentes de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);

// Stores
const indicadoresStore = useIndicadoresStore();
const simuladorStore = useSimuladorStore();
const simulacionesStore = useSimulacionesStore();

// Referencias
const montoSolicitado = ref(50000000);
const esCliente = ref(true);
const valorUVAInicial = ref(0);
const inflacionEstimada = ref(60);

// Computed properties
const tasaInteres = computed(() => (esCliente.value ? 3.5 : 8));
const tasaMensual = computed(
    () => Math.pow(1 + tasaInteres.value / 100, 1 / 12) - 1,
);
const tasaMensualPorcentaje = computed(() =>
    (tasaMensual.value * 100).toFixed(2),
);
const montoEnUVA = computed(
    () => montoSolicitado.value / valorUVAInicial.value || 0,
);
const inflacionMensual = computed(
    () => Math.pow(1 + inflacionEstimada.value / 100, 1 / 12) - 1,
);
const cuotaUVAs = computed(() => {
    if (!montoSolicitado.value || !valorUVAInicial.value) return 0;
    const capitalUVA = montoSolicitado.value / valorUVAInicial.value;
    return (
        (capitalUVA *
            tasaMensual.value *
            Math.pow(1 + tasaMensual.value, simuladorStore.plazoMeses)) /
        (Math.pow(1 + tasaMensual.value, simuladorStore.plazoMeses) - 1)
    );
});
const totalUVAsADevolver = computed(
    () => cuotaUVAs.value * simuladorStore.plazoMeses,
);
const cuotaPesos = computed(() => cuotaUVAs.value * valorUVAInicial.value);
const ingresoMinimo = computed(() => cuotaPesos.value * 3.33);
const montoFormateado = computed(() => formatearMoneda(montoSolicitado.value));

// Función principal de cálculo
function calcularPrestamo() {
    if (
        !montoSolicitado.value ||
        montoSolicitado.value <= 0 ||
        !valorUVAInicial.value
    ) {
        simuladorStore.resetDatosGrafico();
        return;
    }

    const capitalUVA = montoSolicitado.value / valorUVAInicial.value;
    const tasaMensualEfectiva = tasaMensual.value;
    const cuotaUVA = cuotaUVAs.value;

    // Calcular tabla de amortización en UVAs
    let saldoUVA = capitalUVA;
    let cuotasSimuladas = [];
    let valorUVAProyectado = valorUVAInicial.value;

    // Generar datos para todos los meses
    for (let mes = 1; mes <= simuladorStore.plazoMeses; mes++) {
        // Cálculos en UVAs
        const interesUVA = saldoUVA * tasaMensualEfectiva;
        const capitalCuotaUVA = cuotaUVA - interesUVA;
        saldoUVA -= capitalCuotaUVA;

        // Proyección del valor UVA
        valorUVAProyectado *= 1 + inflacionMensual.value;

        // Convertir valores UVA a pesos para la visualización
        const cuotaPesosProyectada = cuotaUVA * valorUVAProyectado;

        // Guardar datos de cada mes
        cuotasSimuladas.push({
            mes,
            cuotaUVA: cuotaUVA,
            cuotaPesos: cuotaPesosProyectada,
            saldoUVA: saldoUVA,
            valorUVA: valorUVAProyectado,
        });
    }

    // Actualizar datos del gráfico en el store
    simuladorStore.setDatosGrafico({
        labels: cuotasSimuladas.map((c) => `Mes ${c.mes}`),
        datasets: [
            {
                label: "Cuota en Pesos",
                data: cuotasSimuladas.map((c) => c.cuotaPesos),
                borderColor: "#3B82F6",
                tension: 0.1,
                yAxisID: "y",
            },
            {
                label: "Cuota en UVAs",
                data: cuotasSimuladas.map((c) => c.cuotaUVA),
                borderColor: "#10B981",
                tension: 0.1,
                yAxisID: "y1",
            },
        ],
    });
}

// Función para guardar la simulación
async function guardarSimulacion() {
    try {
        const simulacion = {
            montoSolicitado: montoSolicitado.value,
            plazoMeses: simuladorStore.plazoMeses,
            datosCliente: {
                nombre: "Nombre del Cliente",
                apellido: "Apellido del Cliente",
                email: "cliente@example.com",
                telefono: "123456789",
                observaciones: "Observaciones del cliente",
            },
            parametros: {
                tasaInteres: tasaInteres.value,
                inflacionEstimada: inflacionEstimada.value,
                valorUVAInicial: valorUVAInicial.value,
                esCliente: esCliente.value,
            },
            resultados: {
                cuotaInicial: cuotaPesos.value,
                cuotaUVAs: cuotaUVAs.value,
                ingresoMinimo: ingresoMinimo.value,
                totalUVAsADevolver: totalUVAsADevolver.value,
            },
            grafico: simuladorStore.chartData,
        };

        await simulacionesStore.guardarSimulacion(simulacion);
        alert("Simulación guardada exitosamente");
    } catch (error) {
        console.error("Error al guardar la simulación:", error);
        alert("Error al guardar la simulación");
    }
}

// Event handlers
const handleMontoInput = (event) => {
    const valor = parsearMoneda(event.target.value);
    montoSolicitado.value = valor;
    calcularPrestamo();
};

// Watchers
watch(
    [
        () => simuladorStore.plazoMeses,
        () => esCliente.value,
        () => inflacionEstimada.value,
    ],
    () => {
        calcularPrestamo();
    },
);

watch(
    () => indicadoresStore.valorUVA,
    (newValue) => {
        if (newValue) {
            valorUVAInicial.value = newValue;
            calcularPrestamo();
        }
    },
);

// Configuración del gráfico
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        mode: "index",
        intersect: false,
    },
    plugins: {
        legend: {
            position: "top",
            labels: {
                boxWidth: 10,
                usePointStyle: true,
            },
        },
        tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
                label(context) {
                    let label = context.dataset.label || "";
                    if (label) {
                        label += ": ";
                    }
                    if (context.parsed.y !== null) {
                        if (context.dataset.yAxisID === "y") {
                            label += `$${formatearMoneda(context.parsed.y)}`;
                        } else {
                            label += `${context.parsed.y.toFixed(2)} UVAs`;
                        }
                    }
                    return label;
                },
            },
        },
    },
    scales: {
        y: {
            type: "linear",
            display: true,
            position: "left",
            title: {
                display: true,
                text: "Pesos",
                color: "#3B82F6",
            },
            ticks: {
                callback(value) {
                    return `$${formatearMoneda(value)}`;
                },
                font: { size: 10 },
            },
        },
        y1: {
            type: "linear",
            display: true,
            position: "right",
            title: {
                display: true,
                text: "UVAs",
                color: "#10B981",
            },
            grid: {
                drawOnChartArea: false,
            },
            ticks: {
                font: { size: 10 },
            },
        },
        x: {
            ticks: {
                maxRotation: 0,
                font: { size: 10 },
            },
        },
    },
};

// Funciones auxiliares
const formatearMoneda = (valor) => {
    if (!valor) return "0";
    return new Intl.NumberFormat("es-AR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(valor);
};

const parsearMoneda = (valor) => {
    return Number(valor.replace(/[^0-9]/g, ""));
};

// Inicialización
onMounted(async () => {
    await indicadoresStore.fetchAllData();
    valorUVAInicial.value = indicadoresStore.valorUVA;
    calcularPrestamo();
});
</script>
