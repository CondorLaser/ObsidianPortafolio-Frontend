export const portfolioSummary = {
  totalValue: "$93.591",
  totalReturn: "$6.422",
  totalReturnPct: "+7.37%",
  activePositions: "6 activos",
  linkedAccounts: "2 cuentas"
};

export const accountDistribution = [
  { name: "Fintual USD", value: "58%" },
  { name: "Fintual CLP", value: "42%" }
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
    returnPct: "+5.90%"
  },
  {
    symbol: "VTI",
    name: "Vanguard Total Stock Market ETF",
    type: "ETF",
    account: "Fintual USD",
    quantity: "40",
    currentPrice: "$239",
    totalValue: "$9.556",
    returnPct: "+5.80%"
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    type: "Accion",
    account: "Fintual USD",
    quantity: "50",
    currentPrice: "$186",
    totalValue: "$9.310",
    returnPct: "+4.32%"
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
