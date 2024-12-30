<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold mb-6 dark:text-white">
            Historial de Simulaciones
        </h1>

        <div v-if="simulacionesStore.loading" class="text-center py-8">
            <div
                class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
            ></div>
        </div>

        <div
            v-else-if="simulacionesStore.error"
            class="text-red-600 text-center py-8"
        >
            {{ simulacionesStore.error }}
        </div>

        <div
            v-else-if="simulacionesStore.simulaciones.length === 0"
            class="text-center py-8"
        >
            <p class="text-gray-600 dark:text-gray-400">
                No hay simulaciones guardadas
            </p>
        </div>

        <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div
                v-for="simulacion in simulacionesOrdenadas"
                :key="simulacion.id"
                class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
                <div class="mb-4">
                    <h3 class="text-lg font-semibold dark:text-white">
                        {{ simulacion.datosCliente?.nombre || "Cliente" }}
                        {{ simulacion.datosCliente?.apellido || "" }}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{
                            new Date(
                                simulacion.fechaCreacion,
                            ).toLocaleDateString()
                        }}
                    </p>
                </div>

                <div class="space-y-2">
                    <div>
                        <p
                            class="text-sm font-medium text-gray-600 dark:text-gray-400"
                        >
                            Monto solicitado
                        </p>
                        <p class="text-lg font-semibold dark:text-white">
                            ${{ formatearMoneda(simulacion.montoSolicitado) }}
                        </p>
                    </div>

                    <div>
                        <p
                            class="text-sm font-medium text-gray-600 dark:text-gray-400"
                        >
                            Plazo
                        </p>
                        <p class="dark:text-white">
                            {{ simulacion.plazoMeses }} meses
                        </p>
                    </div>

                    <div>
                        <p
                            class="text-sm font-medium text-gray-600 dark:text-gray-400"
                        >
                            Cuota inicial
                        </p>
                        <p class="dark:text-white">
                            ${{
                                formatearMoneda(
                                    simulacion.resultados?.cuotaInicial || 0,
                                )
                            }}
                        </p>
                    </div>

                    <div>
                        <p
                            class="text-sm font-medium text-gray-600 dark:text-gray-400"
                        >
                            Ingreso mínimo
                        </p>
                        <p class="dark:text-white">
                            ${{
                                formatearMoneda(
                                    simulacion.resultados?.ingresoMinimo || 0,
                                )
                            }}
                        </p>
                    </div>
                </div>

                <div class="mt-4 pt-4 border-t dark:border-gray-700">
                    <p
                        v-if="simulacion.datosCliente?.email"
                        class="text-sm text-gray-600 dark:text-gray-400"
                    >
                        {{ simulacion.datosCliente.email }}
                    </p>
                    <p
                        v-if="simulacion.datosCliente?.telefono"
                        class="text-sm text-gray-600 dark:text-gray-400"
                    >
                        {{ simulacion.datosCliente.telefono }}
                    </p>
                    <p
                        v-if="simulacion.datosCliente?.observaciones"
                        class="mt-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                        {{ simulacion.datosCliente.observaciones }}
                    </p>
                    <div class="mt-4 flex gap-2">
                        <button
                            @click="cargarSimulacion(simulacion)"
                            class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            :disabled="
                                simulacionesStore.loading ||
                                clientesStore.loading
                            "
                        >
                            {{
                                simulacionesStore.loading ||
                                clientesStore.loading
                                    ? "Cargando..."
                                    : "Editar Simulación"
                            }}
                        </button>
                        <button
                            @click="guardarSimulacion(simulacion)"
                            class="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                            :disabled="simulacionesStore.loading"
                        >
                            {{
                                simulacionesStore.loading
                                    ? "Guardando..."
                                    : "Guardar Simulación"
                            }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="error" class="text-red-600 text-center py-8">
            {{ error }}
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useSimulacionesStore } from "@/stores/simulaciones";
import { useRouter } from "vue-router";
import { useClientesStore } from "@/stores/clientes";

const router = useRouter();
const simulacionesStore = useSimulacionesStore();
const clientesStore = useClientesStore();
const error = ref(null);

const simulacionesOrdenadas = computed(() => {
    return [...simulacionesStore.simulaciones].sort((a, b) => {
        return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
    });
});

const formatearMoneda = (valor) => {
    return new Intl.NumberFormat("es-AR", {
        style: "decimal",
        maximumFractionDigits: 0,
    }).format(valor);
};

const cargarSimulacion = async (simulacion) => {
    try {
        error.value = null;

        // Guardar la simulación seleccionada en el store primero
        simulacionesStore.setSimulacionSeleccionada(simulacion);

        // Si hay datos del cliente, seleccionarlo
        if (simulacion.datosCliente?.id) {
            await clientesStore.seleccionarClientePorId(
                simulacion.datosCliente.id,
            );
        }

        // Navegar al simulador
        router.push("/simulador");
    } catch (err) {
        console.error("Error al cargar la simulación:", err);
        error.value = "Error al cargar la simulación: " + err.message;
    }
};

const guardarSimulacion = async (simulacion) => {
    try {
        error.value = null;
        await simulacionesStore.guardarSimulacion(simulacion);
        alert("Simulación guardada exitosamente");
    } catch (err) {
        console.error("Error al guardar la simulación:", err);
        error.value = "Error al guardar la simulación: " + err.message;
    }
};

onMounted(async () => {
    try {
        error.value = null;
        await simulacionesStore.cargarSimulaciones();
    } catch (err) {
        error.value = "Error al cargar las simulaciones: " + err.message;
    }
});
</script>
