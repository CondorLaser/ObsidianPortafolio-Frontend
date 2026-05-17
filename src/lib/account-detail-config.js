export const accountCards = [
  {
    slug: "fintual-usd",
    name: "Fintual USD",
    shortLabel: "USD",
    amount: "$54.283",
    share: "58%",
    change: "+8.1%",
    status: "Sincronizada",
    accountCountLabel: "3 activos",
    dividends: "$246",
    lastTransaction: "11-05-2026",
    description: "Cuenta en dólares con ETFs y acciones internacionales cargadas desde certificado exportable.",
    trend: [41, 43, 45, 48, 51, 54],
    trendLabels: ["ene", "feb", "mar", "abr", "may", "jun"]
  },
  {
    slug: "fintual-clp",
    name: "Fintual CLP",
    shortLabel: "CLP",
    amount: "$39.308",
    share: "42%",
    change: "+6.2%",
    status: "Certificado cargado",
    accountCountLabel: "3 activos",
    dividends: "$118",
    lastTransaction: "28-04-2026",
    description: "Cuenta en pesos con fondos locales, acciones chilenas y caja operativa para seguimiento del portafolio.",
    trend: [28, 29, 31, 32, 35, 39],
    trendLabels: ["ene", "feb", "mar", "abr", "may", "jun"]
  }
];

export const accountDetailConfig = Object.fromEntries(accountCards.map((account) => [account.slug, account]));
