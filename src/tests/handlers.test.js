import { describe, it, expect } from 'vitest'

// Extraemos las funciones puras para testearlas directamente
// (Las definimos igual que en handlers.js para poder testear sin levantar MSW)

const formatCurrency = (value, currency = "USD") => {
  const number = Number(value || 0)
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency,
    maximumFractionDigits: number % 1 === 0 ? 0 : 2
  }).format(number)
}

const formatPercent = (value) => {
  const number = Number(value || 0)
  return `${number >= 0 ? "+" : ""}${(number * 100).toFixed(2)}%`
}

const buildPriceHistory = (currentPrice, returnPct) => {
  const current = Number(currentPrice || 0)
  const variation = Number(returnPct || 0)
  const start = Math.max(current / (1 + Math.max(variation, -0.85)), current * 0.82)
  return [
    start,
    start * 1.04,
    start * 1.09,
    current * 0.94,
    current * 0.98,
    current
  ].map((value) => Number(value.toFixed(2)))
}

const getAssetTypeLabel = (kind) => {
  if (kind === "stock") return "Acción"
  if (kind === "etf") return "ETF"
  if (kind === "fund") return "Fondo mutuo"
  return "Activo"
}

describe('formatCurrency', () => {
  it('formatea USD correctamente en locale es-CL', () => {
    const result = formatCurrency(1000, 'USD')
    expect(result).toContain('1.000')  // es-CL usa punto como separador de miles
  })

  it('formatea CLP sin decimales para montos enteros', () => {
    const result = formatCurrency(8300, 'CLP')
    expect(result).not.toContain(',')
    expect(result).toContain('8.300')
  })

  it('trata null y undefined como 0', () => {
    expect(formatCurrency(null, 'USD')).toBe(formatCurrency(0, 'USD'))
    expect(formatCurrency(undefined, 'USD')).toBe(formatCurrency(0, 'USD'))
  })

  it('incluye decimales para montos no enteros en USD', () => {
    const result = formatCurrency(100.50, 'USD')
    expect(result).toContain(',50')  // es-CL usa coma para decimales
  })
})

describe('formatPercent', () => {
  it('agrega + para valores positivos', () => {
    expect(formatPercent(0.05)).toBe('+5.00%')
  })

  it('no agrega + para valores negativos', () => {
    expect(formatPercent(-0.05)).toBe('-5.00%')
  })

  it('trata null como 0', () => {
    expect(formatPercent(null)).toBe('+0.00%')
  })

  it('formatea correctamente el 0', () => {
    expect(formatPercent(0)).toBe('+0.00%')
  })
})

describe('buildPriceHistory', () => {
  it('retorna siempre 6 puntos', () => {
    expect(buildPriceHistory(100, 0.05)).toHaveLength(6)
  })

  it('el último valor es siempre el precio actual', () => {
    const history = buildPriceHistory(445, 0.059)
    expect(history[5]).toBe(445)
  })

  it('maneja retorno negativo sin explotar (floor en -85%)', () => {
    const history = buildPriceHistory(100, -0.95)
    expect(history).toHaveLength(6)
    history.forEach(v => expect(v).toBeGreaterThan(0))
  })

  it('todos los valores son números válidos', () => {
    const history = buildPriceHistory(239, 0.058)
    history.forEach(v => expect(typeof v).toBe('number'))
    history.forEach(v => expect(isNaN(v)).toBe(false))
  })
})

describe('getAssetTypeLabel', () => {
  it('mapea stock → Acción', () => expect(getAssetTypeLabel('stock')).toBe('Acción'))
  it('mapea etf → ETF', () => expect(getAssetTypeLabel('etf')).toBe('ETF'))
  it('mapea fund → Fondo mutuo', () => expect(getAssetTypeLabel('fund')).toBe('Fondo mutuo'))
  it('retorna "Activo" para kind desconocido', () => expect(getAssetTypeLabel('otro')).toBe('Activo'))
})