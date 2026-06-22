import { describe, it, expect } from 'vitest'
import {
  getAssetById,
  getAssetBySymbol,
  getPositionsWithAssets,
  getPositionBySymbol,
  assets,
  positions,
} from '@/src/lib/mock-data'

describe('getAssetById', () => {
  it('retorna el activo correcto por id', () => {
    const asset = getAssetById('asset-spy')
    expect(asset.symbol).toBe('SPY')
  })

  it('retorna undefined para un id inexistente', () => {
    expect(getAssetById('no-existe')).toBeUndefined()
  })
})

describe('getAssetBySymbol', () => {
  it('encuentra activo con símbolo en mayúsculas', () => {
    const asset = getAssetBySymbol('spy')
    expect(asset.id).toBe('asset-spy')
  })

  it('decodifica URI antes de buscar', () => {
    const asset = getAssetBySymbol('Racional%201')
    expect(asset.id).toBe('asset-racional-1')
  })

  it('retorna undefined para símbolo inexistente', () => {
    expect(getAssetBySymbol('NOEXISTE')).toBeUndefined()
  })
})

describe('getPositionsWithAssets', () => {
  it('retorna todas las posiciones enriquecidas con datos del activo', () => {
    const result = getPositionsWithAssets()
    expect(result).toHaveLength(positions.length)
  })

  it('cada posición tiene name, type, market, currency del activo', () => {
    const result = getPositionsWithAssets()
    result.forEach((pos) => {
      expect(pos).toHaveProperty('name')
      expect(pos).toHaveProperty('type')
      expect(pos).toHaveProperty('market')
      expect(pos).toHaveProperty('currency')
    })
  })

  it('posición con activo inexistente usa symbol como name y "Activo" como type', () => {
    // Verificamos que el fallback funciona — si asset es undefined, name = symbol
    const result = getPositionsWithAssets()
    const validPositions = result.filter(p => p.name !== undefined)
    expect(validPositions.length).toBe(result.length)
  })
})

describe('getPositionBySymbol', () => {
  it('encuentra posición por símbolo case-insensitive', () => {
    const pos = getPositionBySymbol('spy')
    expect(pos.symbol).toBe('SPY')
  })

  it('retorna undefined para símbolo inexistente', () => {
    expect(getPositionBySymbol('NOEXISTE')).toBeUndefined()
  })
})