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

export const positions = [
  {
    symbol: "SPY",
    name: "SPDR S&P 500 ETF",
    type: "ETF",
    account: "Fintual USD",
    quantity: "25",
    currentPrice: "$445",
    totalValue: "$11.133",
    returnPct: "+5.90%",
    weight: "11.9%",
    source: "Certificado USD"
  },
  {
    symbol: "VTI",
    name: "Vanguard Total Stock Market ETF",
    type: "ETF",
    account: "Fintual USD",
    quantity: "40",
    currentPrice: "$239",
    totalValue: "$9.556",
    returnPct: "+5.80%",
    weight: "10.2%",
    source: "Certificado USD"
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    type: "Accion",
    account: "Fintual USD",
    quantity: "50",
    currentPrice: "$186",
    totalValue: "$9.310",
    returnPct: "+4.32%",
    weight: "9.9%",
    source: "Certificado USD"
  },
  {
    symbol: "Racional 1",
    name: "Fondo Balanceado CLP",
    type: "Fondo mutuo",
    account: "Fintual CLP",
    quantity: "1.240",
    currentPrice: "$8.300",
    totalValue: "$10.292",
    returnPct: "+7.14%",
    weight: "11.0%",
    source: "Certificado CLP"
  },
  {
    symbol: "BICECORP",
    name: "Bicecorp Acciones Chile",
    type: "Accion",
    account: "Fintual CLP",
    quantity: "320",
    currentPrice: "$11.900",
    totalValue: "$3.808",
    returnPct: "-1.12%",
    weight: "4.1%",
    source: "Certificado CLP"
  },
  {
    symbol: "CASH",
    name: "Caja operativa",
    type: "Liquidez",
    account: "Fintual CLP",
    quantity: "1",
    currentPrice: "$4.120",
    totalValue: "$4.120",
    returnPct: "0.00%",
    weight: "4.4%",
    source: "Certificado CLP"
  }
];

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
