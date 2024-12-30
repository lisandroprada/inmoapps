import { defineStore } from 'pinia'
import axios from 'axios'

export const useIndicadoresStore = defineStore('indicadores', {
  state: () => ({
    uva: {
      datos: [],
      loading: false,
      error: null
    },
    inflacion: {
      datos: [],
      loading: false,
      error: null
    },
    inflacionInteranual: {
      datos: [],
      loading: false,
      error: null
    },
    riesgoPais: {
      datos: [],
      loading: false,
      error: null
    },
    periodoSeleccionado: '12m' // '6m', '12m', '5y'
  }),

  getters: {
    datosFiltrados: (state) => {
      const filtrarPorPeriodo = (datos) => {
        if (!datos.length) return []
        
        const ahora = new Date()
        const limiteInferior = new Date()
        
        switch (state.periodoSeleccionado) {
          case '6m':
            limiteInferior.setMonth(ahora.getMonth() - 6)
            break
          case '12m':
            limiteInferior.setMonth(ahora.getMonth() - 12)
            break
          case '5y':
            limiteInferior.setFullYear(ahora.getFullYear() - 5)
            break
        }

        return datos.filter(item => new Date(item.fecha) >= limiteInferior)
      }

      return {
        uva: filtrarPorPeriodo(state.uva.datos),
        inflacion: filtrarPorPeriodo(state.inflacion.datos),
        inflacionInteranual: filtrarPorPeriodo(state.inflacionInteranual.datos),
        riesgoPais: filtrarPorPeriodo(state.riesgoPais.datos)
      }
    },

    valorUVA: (state) => {
      if (!state.uva.datos.length) return 0
      return state.uva.datos[state.uva.datos.length - 1].valor
    },

    fechaActualizacion: (state) => {
      if (!state.uva.datos.length) return ''
      const fecha = new Date(state.uva.datos[state.uva.datos.length - 1].fecha)
      return fecha.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    },

    chartData: (state) => (indicador) => {
      const datos = state.datosFiltrados[indicador] || []
      const configuraciones = {
        uva: {
          label: 'Valor UVA',
          color: '#0ea5e9',
          formato: (valor) => `$${valor.toFixed(2)}`
        },
        inflacion: {
          label: 'Inflación Mensual',
          color: '#10b981',
          formato: (valor) => `${valor.toFixed(1)}%`
        },
        inflacionInteranual: {
          label: 'Inflación Interanual',
          color: '#f59e0b',
          formato: (valor) => `${valor.toFixed(1)}%`
        },
        riesgoPais: {
          label: 'Riesgo País',
          color: '#ef4444',
          formato: (valor) => valor.toFixed(0)
        }
      }

      const config = configuraciones[indicador]
      
      return {
        labels: datos.map(item => item.fecha),
        datasets: [{
          label: config.label,
          data: datos.map(item => item.valor),
          borderColor: config.color,
          backgroundColor: `${config.color}19`,
          fill: true,
          tension: 0.4
        }]
      }
    }
  },

  actions: {
    async fetchData(indicador, url) {
      this[indicador].loading = true
      this[indicador].error = null
      
      try {
        const response = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (response.data && response.data.length > 0) {
          this[indicador].datos = response.data.map(item => ({
            fecha: item.fecha || item.d,
            valor: item.valor || item.v
          })).sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        }
      } catch (error) {
        console.error(`Error al obtener datos de ${indicador}:`, error)
        this[indicador].error = `Error al obtener datos de ${indicador}`
      } finally {
        this[indicador].loading = false
      }
    },

    async fetchAllData() {
      const endpoints = {
        uva: 'https://api.argentinadatos.com/v1/finanzas/indices/uva',
        inflacion: 'https://api.argentinadatos.com/v1/finanzas/indices/inflacion',
        inflacionInteranual: 'https://api.argentinadatos.com/v1/finanzas/indices/inflacionInteranual',
        riesgoPais: 'https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais'
      }

      await Promise.all(
        Object.entries(endpoints).map(([indicador, url]) => 
          this.fetchData(indicador, url)
        )
      )
    },

    setPeriodo(periodo) {
      this.periodoSeleccionado = periodo
    }
  }
})
