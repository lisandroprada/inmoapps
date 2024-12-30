/**
 * Formatea un número como moneda en pesos argentinos
 * @param {number} valor - El valor a formatear
 * @returns {string} El valor formateado
 */
export const formatearNumero = (valor) => {
  if (typeof valor !== 'number') return '0'
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor)
}

/**
 * Formatea una fecha en formato local argentino
 * @param {Date} fecha - La fecha a formatear
 * @returns {string} La fecha formateada
 */
export const formatearFecha = (fecha) => {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(fecha instanceof Date ? fecha : new Date(fecha))
}

/**
 * Parsea un string con formato de moneda a número
 * @param {string} valor - El string a parsear
 * @returns {number} El valor numérico
 */
export const parsearMoneda = (valor) => {
  if (typeof valor !== 'string') return 0
  return Number(valor.replace(/[^0-9,-]/g, '').replace(',', '.')) || 0
}
