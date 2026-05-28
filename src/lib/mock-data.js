export const portfolioSummary = {
  totalValue: "$93.591",
  totalReturn: "$6.422",
  totalReturnPct: "+7.37%",
  activePositions: "6",
  linkedAccounts: "2",
  lastImport: "11 may, 18:40",
  dataFreshness: "+6.8% ultimo periodo",
  pendingItems: "Fintual USD y CLP"
};

export const accountDistribution = [
  {
    name: "Fintual USD",
    value: "58%",
    amount: "$54.283",
    change: "+8.1%",
    status: "Sincronizada"
  },
  {
    name: "Fintual CLP",
    value: "42%",
    amount: "$39.308",
    change: "+6.2%",
    status: "Certificado cargado"
  }
];

export const portfolioTrend = [
  { label: "ene", value: 44 },
  { label: "feb", value: 47 },
  { label: "mar", value: 49 },
  { label: "abr", value: 53 },
  { label: "may", value: 57 },
  { label: "jun", value: 61 }
];

export const operationalStatus = [
  {
    label: "Fuente principal",
    value: "Carga manual de certificados",
    tone: "accent"
  },
  {
    label: "Ultima importacion",
    value: "11 mayo, 18:40",
    tone: "default"
  },
  {
    label: "Health check backend",
    value: "Conectado",
    tone: "success"
  },
  {
    label: "Siguiente accion",
    value: "Subir certificado de abril",
    tone: "warning"
  }
];

export const certificateStatus = [
  {
    title: "Acciones y ETFs",
    status: "Actualizado",
    detail: "28 abr 2026, 10:06",
    tone: "success"
  },
  {
    title: "Fondos mutuos",
    status: "Actualizado",
    detail: "25 abr 2026, 19:25",
    tone: "default"
  }
];

export const dashboardHighlights = [
  {
    title: "Movimientos a revisar",
    detail: "2 alertas y 1 recomendacion nueva desde la ultima carga."
  },
  {
    title: "Cobertura de datos",
    detail: "El 100% del portafolio ya tiene clasificacion por cuenta y activo."
  },
  {
    title: "Proximo paso sugerido",
    detail: "Actualizar certificados y validar el origen de precios para fondos locales."
  }
];

export const assets = [
  {
    id: "asset-spy",
    symbol: "SPY",
    name: "SPDR S&P 500 ETF",
    type: "ETF",
    market: "Estados Unidos",
    currency: "USD",
    currentPrice: "$445",
    priceSource: "Mercado internacional",
    priceHistory: [18, 24, 42, 48, 61, 69],
    dailyMetrics: {
      absoluteReturn: "+0.52%",
      volatility: "11.2%",
      maxDrawdown: "-3.1%"
    },
    monthlyMetrics: {
      absoluteReturn: "+5.90%",
      volatility: "9.8%",
      maxDrawdown: "-4.6%"
    }
  },
  {
    id: "asset-vti",
    symbol: "VTI",
    name: "Vanguard Total Stock Market ETF",
    type: "ETF",
    market: "Estados Unidos",
    currency: "USD",
    currentPrice: "$239",
    priceSource: "Mercado internacional",
    priceHistory: [16, 20, 35, 39, 53, 58],
    dailyMetrics: {
      absoluteReturn: "+0.48%",
      volatility: "10.7%",
      maxDrawdown: "-2.8%"
    },
    monthlyMetrics: {
      absoluteReturn: "+5.80%",
      volatility: "9.4%",
      maxDrawdown: "-4.1%"
    }
  },
  {
    id: "asset-aapl",
    symbol: "AAPL",
    name: "Apple Inc.",
    type: "Accion",
    market: "Estados Unidos",
    currency: "USD",
    currentPrice: "$186",
    priceSource: "Mercado internacional",
    priceHistory: [14, 19, 27, 33, 44, 51],
    dailyMetrics: {
      absoluteReturn: "-1.80%",
      volatility: "18.4%",
      maxDrawdown: "-10.2%"
    },
    monthlyMetrics: {
      absoluteReturn: "+4.32%",
      volatility: "16.8%",
      maxDrawdown: "-12.0%"
    }
  },
  {
    id: "asset-racional-1",
    symbol: "Racional 1",
    name: "Fondo Balanceado CLP",
    type: "Fondo mutuo",
    market: "Chile",
    currency: "CLP",
    currentPrice: "$8.300",
    priceSource: "Certificado CLP",
    priceHistory: [20, 23, 31, 39, 45, 52],
    dailyMetrics: {
      absoluteReturn: "+0.20%",
      volatility: "6.8%",
      maxDrawdown: "-1.4%"
    },
    monthlyMetrics: {
      absoluteReturn: "+7.14%",
      volatility: "6.2%",
      maxDrawdown: "-2.2%"
    }
  },
  {
    id: "asset-bicecorp",
    symbol: "BICECORP",
    name: "Bicecorp Acciones Chile",
    type: "Accion",
    market: "Chile",
    currency: "CLP",
    currentPrice: "$11.900",
    priceSource: "Certificado CLP",
    priceHistory: [31, 34, 29, 32, 30, 28],
    dailyMetrics: {
      absoluteReturn: "-0.36%",
      volatility: "14.9%",
      maxDrawdown: "-7.6%"
    },
    monthlyMetrics: {
      absoluteReturn: "-1.12%",
      volatility: "13.2%",
      maxDrawdown: "-8.9%"
    }
  },
  {
    id: "asset-cash",
    symbol: "CASH",
    name: "Caja operativa",
    type: "Liquidez",
    market: "Chile",
    currency: "CLP",
    currentPrice: "$4.120",
    priceSource: "Certificado CLP",
    priceHistory: [40, 40, 40, 40, 40, 40],
    dailyMetrics: {
      absoluteReturn: "0.00%",
      volatility: "0.0%",
      maxDrawdown: "0.0%"
    },
    monthlyMetrics: {
      absoluteReturn: "0.00%",
      volatility: "0.0%",
      maxDrawdown: "0.0%"
    }
  }
];

export const positions = [
  {
    id: "position-spy-usd",
    accountId: "fintual-usd",
    assetId: "asset-spy",
    symbol: "SPY",
    account: "Fintual USD",
    quantity: "25",
    avgCost: "$421",
    totalValue: "$11.133",
    unrealizedPnl: "$622",
    realizedPnl: "$0",
    totalDividends: "$18",
    totalFees: "$1,5",
    currentPrice: "$445",
    returnPct: "+5.90%",
    weight: "11.9%",
    source: "Certificado USD",
    lastTransactionAt: "10 feb 2026, 14:30",
    updatedAt: "15 abr 2026, 18:00"
  },
  {
    id: "position-vti-usd",
    accountId: "fintual-usd",
    assetId: "asset-vti",
    symbol: "VTI",
    account: "Fintual USD",
    quantity: "40",
    avgCost: "$226",
    totalValue: "$9.556",
    unrealizedPnl: "$524",
    realizedPnl: "$0",
    totalDividends: "$12",
    totalFees: "$1,1",
    currentPrice: "$239",
    returnPct: "+5.80%",
    weight: "10.2%",
    source: "Certificado USD",
    lastTransactionAt: "18 feb 2026, 11:10",
    updatedAt: "15 abr 2026, 18:00"
  },
  {
    id: "position-aapl-usd",
    accountId: "fintual-usd",
    assetId: "asset-aapl",
    symbol: "AAPL",
    account: "Fintual USD",
    quantity: "50",
    avgCost: "$178",
    totalValue: "$9.310",
    unrealizedPnl: "$386",
    realizedPnl: "$0",
    totalDividends: "$8",
    totalFees: "$1,3",
    currentPrice: "$186",
    returnPct: "+4.32%",
    weight: "9.9%",
    source: "Certificado USD",
    lastTransactionAt: "21 mar 2026, 10:24",
    updatedAt: "15 abr 2026, 18:00"
  },
  {
    id: "position-racional-clp",
    accountId: "fintual-clp",
    assetId: "asset-racional-1",
    symbol: "Racional 1",
    account: "Fintual CLP",
    quantity: "1.240",
    avgCost: "$7.740",
    totalValue: "$10.292",
    unrealizedPnl: "$687",
    realizedPnl: "$0",
    totalDividends: "$0",
    totalFees: "$2,0",
    currentPrice: "$8.300",
    returnPct: "+7.14%",
    weight: "11.0%",
    source: "Certificado CLP",
    lastTransactionAt: "01 abr 2026, 09:30",
    updatedAt: "15 abr 2026, 18:00"
  },
  {
    id: "position-bicecorp-clp",
    accountId: "fintual-clp",
    assetId: "asset-bicecorp",
    symbol: "BICECORP",
    account: "Fintual CLP",
    quantity: "320",
    avgCost: "$12.040",
    totalValue: "$3.808",
    unrealizedPnl: "-$43",
    realizedPnl: "$0",
    totalDividends: "$0",
    totalFees: "$0,8",
    currentPrice: "$11.900",
    returnPct: "-1.12%",
    weight: "4.1%",
    source: "Certificado CLP",
    lastTransactionAt: "27 mar 2026, 16:12",
    updatedAt: "15 abr 2026, 18:00"
  },
  {
    id: "position-cash-clp",
    accountId: "fintual-clp",
    assetId: "asset-cash",
    symbol: "CASH",
    account: "Fintual CLP",
    quantity: "1",
    avgCost: "$4.120",
    totalValue: "$4.120",
    unrealizedPnl: "$0",
    realizedPnl: "$0",
    totalDividends: "$0",
    totalFees: "$0",
    currentPrice: "$4.120",
    returnPct: "0.00%",
    weight: "4.4%",
    source: "Certificado CLP",
    lastTransactionAt: "01 abr 2026, 09:30",
    updatedAt: "15 abr 2026, 18:00"
  }
];

export function getAssetById(assetId) {
  return assets.find((asset) => asset.id === assetId);
}

export function getAssetBySymbol(symbol) {
  const normalizedSymbol = decodeURIComponent(symbol).toUpperCase();

  return assets.find((asset) => asset.symbol.toUpperCase() === normalizedSymbol);
}

export function getPositionsWithAssets() {
  return positions.map((position) => {
    const asset = getAssetById(position.assetId);

    return {
      ...position,
      name: asset?.name ?? position.symbol,
      type: asset?.type ?? "Activo",
      market: asset?.market,
      currency: asset?.currency,
      asset
    };
  });
}

export function getPositionBySymbol(symbol) {
  const normalizedSymbol = decodeURIComponent(symbol).toUpperCase();

  return getPositionsWithAssets().find((position) => position.symbol.toUpperCase() === normalizedSymbol);
}

export const alerts = [
  {
    title: "Caida significativa detectada",
    detail: "AAPL bajo mas del 10% en las ultimas 24 horas.",
    severity: "Critica"
  },
  {
    title: "Volatilidad elevada",
    detail: "El portafolio muestra una volatilidad superior al promedio.",
    severity: "Advertencia"
  }
];

export const recommendations = [
  {
    symbol: "VTI",
    name: "Vanguard Total Stock Market ETF",
    match: "68%"
  },
  {
    symbol: "IVV",
    name: "iShares Core S&P 500",
    match: "54%"
  }
];
