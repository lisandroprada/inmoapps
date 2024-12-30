import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useSimuladorStore = defineStore("simulador", () => {
  // Estado
  const horizonteSeleccionado = ref("total");
  const datosGrafico = ref({
    labels: [],
    datasets: [],
  });
  const plazoMeses = ref(120);
  const datosOriginales = ref({
    labels: [],
    datasets: [],
  });
  const inflacionEstimada = ref(0);
  const montoSolicitado = ref(0);
  const tasaInteres = ref(0);
  const cuotaCalculada = ref(0);
  const valorUVA = ref(0);

  // Getters
  const chartData = computed(() => {
    if (!datosOriginales.value.labels.length) return datosGrafico.value;

    const mesesMostrar =
      horizonteSeleccionado.value === "doce"
        ? 12
        : horizonteSeleccionado.value === "veinticuatro"
          ? 24
          : plazoMeses.value;

    return {
      labels: datosOriginales.value.labels.slice(0, mesesMostrar),
      datasets: datosOriginales.value.datasets.map((dataset) => ({
        ...dataset,
        data: dataset.data.slice(0, mesesMostrar),
      })),
    };
  });

  // Actions
  function setHorizonte(horizonte) {
    horizonteSeleccionado.value = horizonte;
    datosGrafico.value = chartData.value;
  }

  function setPlazo(plazo) {
    plazoMeses.value = plazo;
  }

  function setDatosGrafico(datos) {
    datosOriginales.value = datos;
    datosGrafico.value = chartData.value;
  }

  function setInflacionEstimada(valor) {
    inflacionEstimada.value = valor;
  }

  function setMontoSolicitado(valor) {
    montoSolicitado.value = valor;
  }

  function setTasaInteres(valor) {
    tasaInteres.value = valor;
  }

  function setValorUVA(valor) {
    valorUVA.value = valor;
  }

  function resetDatosGrafico() {
    const datosVacios = {
      labels: [],
      datasets: [
        {
          label: "Cuota en Pesos",
          data: [],
          borderColor: "#3B82F6",
          tension: 0.1,
        },
        {
          label: "Cuota en UVAs",
          data: [],
          borderColor: "#10B981",
          tension: 0.1,
        },
      ],
    };
    datosOriginales.value = datosVacios;
    datosGrafico.value = datosVacios;
  }

  function calcularCuotaFrances(V, N, i) {
    const tasaMensual = Math.pow(1 + i/100, 1/12) - 1;
    const capitalUVA = V / valorUVA.value;
    const cuotaUVA = (capitalUVA * tasaMensual * Math.pow(1 + tasaMensual, N)) / (Math.pow(1 + tasaMensual, N) - 1);
    return cuotaUVA * valorUVA.value;
  }

  function calcularCuota() {
    const V = montoSolicitado.value;
    const N = plazoMeses.value;
    const i = tasaInteres.value; 

    cuotaCalculada.value = calcularCuotaFrances(V, N, i);
  }

  return {
    // Estado
    horizonteSeleccionado,
    datosGrafico,
    plazoMeses,
    inflacionEstimada,
    montoSolicitado,
    tasaInteres,
    cuotaCalculada,
    valorUVA,

    // Getters
    chartData,

    // Actions
    setHorizonte,
    setPlazo,
    setDatosGrafico,
    setInflacionEstimada,
    setMontoSolicitado,
    setTasaInteres,
    setValorUVA,
    resetDatosGrafico,
    calcularCuota,
  };
});
