export const assetDetailConfigs = {
  SPY: {
    eyebrow: "Detalle de activo",
    description:
      "Vista específica del activo seleccionado para evaluar posición, evolución, alertas relacionadas y siguiente paso recomendado.",
    chartData: [18, 24, 42, 48, 61, 69],
    chartLabels: ["ene", "feb", "mar", "abr", "may", "jun"],
    recommendationDetail: "Mantener como exposición base al mercado estadounidense.",
    alertDetail: "Sin alertas críticas para este activo.",
    dataDetail: "Actualizar certificado de Fintual USD.",
  },
  VTI: {
    eyebrow: "Detalle de activo",
    description:
      "Vista específica del activo seleccionado para revisar su peso en el portafolio y el contexto operativo de la última carga.",
    chartData: [16, 20, 35, 39, 53, 58],
    chartLabels: ["ene", "feb", "mar", "abr", "may", "jun"],
    recommendationDetail: "Mantener exposición diversificada al mercado amplio.",
    alertDetail: "Sin alertas críticas para este activo.",
    dataDetail: "Validar la última carga del certificado USD.",
  },
  AAPL: {
    eyebrow: "Detalle de activo",
    description:
      "Vista específica del activo seleccionado para entender su evolución, concentración relativa y estado de seguimiento.",
    chartData: [14, 19, 27, 33, 44, 51],
    chartLabels: ["ene", "feb", "mar", "abr", "may", "jun"],
    recommendationDetail: "Revisar concentración y peso relativo en la cuenta.",
    alertDetail: "El activo tuvo un cambio reciente y conviene monitorearlo.",
    dataDetail: "Actualizar certificado de Fintual USD.",
  },
  "Racional 1": {
    eyebrow: "Detalle de activo",
    description:
      "Vista específica del fondo local seleccionado para revisar su evolución y retorno dentro de la cuenta CLP.",
    chartData: [20, 23, 31, 39, 45, 52],
    chartLabels: ["ene", "feb", "mar", "abr", "may", "jun"],
    recommendationDetail: "Mantener como base local balanceada mientras se valida el perfil de riesgo.",
    alertDetail: "Sin alertas críticas para este fondo.",
    dataDetail: "Actualizar certificado de Fintual CLP.",
  },
  BICECORP: {
    eyebrow: "Detalle de activo",
    description:
      "Vista específica de la acción chilena seleccionada para revisar caída, exposición y siguiente acción.",
    chartData: [31, 34, 29, 32, 30, 28],
    chartLabels: ["ene", "feb", "mar", "abr", "may", "jun"],
    recommendationDetail: "Monitorear la posición antes de aumentar exposición local.",
    alertDetail: "Retorno negativo reciente; revisar si supera el umbral definido.",
    dataDetail: "Actualizar certificado de Fintual CLP.",
  },
  CASH: {
    eyebrow: "Detalle de activo",
    description:
      "Vista específica de liquidez disponible para entender caja operativa dentro de la cuenta CLP.",
    chartData: [40, 40, 40, 40, 40, 40],
    chartLabels: ["ene", "feb", "mar", "abr", "may", "jun"],
    recommendationDetail: "Usar como reserva operativa o para rebalancear si aparecen oportunidades.",
    alertDetail: "Sin alertas críticas para liquidez.",
    dataDetail: "Actualizar certificado de Fintual CLP.",
  },
};
