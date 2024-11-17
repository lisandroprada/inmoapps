import { defineStore } from 'pinia'
import axios from 'axios'

export const useUvaStore = defineStore('uva', {
  state: () => ({
    valorActual: null,
    fechaActualizacion: null,
    historico: [],
    loading: false,
    error: null
  }),

  getters: {
    valorFormateado: (state) => state.valorActual ? state.valorActual.toFixed(2) : '0.00',
    fechaFormateada: (state) => {
      if (!state.fechaActualizacion) return ''
      const fecha = new Date(state.fechaActualizacion)
      return fecha.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    },
    // Datos formateados para el gráfico
    chartData: (state) => {
      return {
        labels: state.historico.map(item => item.fecha),
        datasets: [{
          label: 'Valor UVA',
          data: state.historico.map(item => item.valor),
          borderColor: '#0ea5e9',
          backgroundColor: 'rgba(14, 165, 233, 0.1)',
          fill: true
        }]
      }
    }
  },

  actions: {
    async fetchUVAData() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get('https://api.argentinadatos.com/v1/finanzas/indices/uva', {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (response.data && response.data.length > 0) {
          // Ordenar los datos por fecha
          const datosOrdenados = response.data.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
          
          // Obtener el último valor
          const ultimoDato = datosOrdenados[datosOrdenados.length - 1]
          this.valorActual = ultimoDato.valor
          this.fechaActualizacion = ultimoDato.fecha
          
          // Guardar el histórico completo para el gráfico
          this.historico = datosOrdenados.map(item => ({
            fecha: item.fecha,
            valor: item.valor
          }))
        }
      } catch (error) {
        console.error('Error al obtener datos UVA:', error)
        this.error = 'Error al obtener datos UVA'
        
        // Valores de respaldo en caso de error
        this.valorActual = 390.82
        this.fechaActualizacion = '2024-01-21'
      } finally {
        this.loading = false
      }
    }
  }
})
