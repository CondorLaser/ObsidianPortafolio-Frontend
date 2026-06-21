import { http, HttpResponse, passthrough } from 'msw'

import asset_data from "./data/asset_actions_mini.json"
import users_data from "./data/users.json"
import user_profiles from "./data/user_profiles.json"
import accounts_data from "./data/accounts.json"
import accounts_daily_metrics from "./data/metrics/account_daily.json"
import accounts_monthly_metrics from "./data/metrics/account_monthly.json"
import asset_daily_metrics from "./data/metrics/asset_daily.json"
import asset_monthly_metrics from "./data/metrics/asset_monthly.json"
import position_daily_metrics from "./data/metrics/position_metrics.daily.json"
import user_preferences from "./data/user_preferences.json"
import asset_prices from "./data/asset_prices.json"
import portfolio_snapshot from "./data/portfolio_snapshot.json"
import positions_data from "./data/positions.json"
import dividends_data from "./data/dividends.json"
import transactions_data from "./data/transactions.json"
import account_names from "./data/accounts_names.json"
 
const API_URL = process.env.NEXT_PUBLIC_URL_BE || ""
const REQUEST_SUCCESSFUL = true
const USE_REAL_UPLOAD = process.env.NEXT_PUBLIC_REAL_UPLOAD === "true"
let accountsStore = [...accounts_data]
let userPreferencesStore = { ...user_preferences }
let warningsStore = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    user_id: "e2e-user",
    type: "drawdown",
    trigger_field: "max_drawdown",
    trigger_value: "-0.128",
    threshold_value: "-0.1",
    msg: "El portafolio supero el umbral configurado de drawdown.",
    is_read: false,
    created_at: new Date().toISOString(),
    notified_at: null,
    last_triggered: new Date().toISOString().slice(0, 10),
    is_active: true
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    user_id: "e2e-user",
    type: "weight",
    trigger_field: "asset_weight",
    trigger_value: "0.42",
    threshold_value: "0.35",
    msg: "Un activo sobrepaso el peso maximo configurado.",
    is_read: true,
    created_at: new Date().toISOString(),
    notified_at: null,
    last_triggered: new Date().toISOString().slice(0, 10),
    is_active: true
  }
]

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

const formatDateTime = (date) => {
  if (!date) return "Sin registro"

  return new Date(date).toLocaleString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

const getAccountById = (accountId) => (
  accountsStore.find((account) => account.id === accountId)
)

const getAssetById = (assetId) => (
  asset_data.find((asset) => asset.id === assetId)
)

const getLatestPrice = (assetId, fallback) => {
  const price = asset_prices.find((item) => item.asset_id === assetId)
  return Number(price?.close ?? fallback ?? 0)
}

const getAssetDailyMetrics = (assetId) => (
  asset_daily_metrics.find((item) => item.asset_id === assetId)
)

const getAssetMonthlyMetrics = (assetId) => (
  asset_monthly_metrics.find((item) => item.asset_id === assetId)
)

const getAssetTypeLabel = (kind) => {
  if (kind === "stock") return "Acción"
  if (kind === "etf") return "ETF"
  if (kind === "fund") return "Fondo mutuo"
  return "Activo"
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

const mapPosition = (position) => {
  const account = getAccountById(position.account_id)
  const asset = position.asset || {}
  const currentPrice = getLatestPrice(position.asset_id, position.avg_cost)
  const totalValue = currentPrice * Number(position.quantity || 0)
  const returnPct = position.avg_cost
    ? (currentPrice - Number(position.avg_cost)) / Number(position.avg_cost)
    : 0
  const dailyMetrics = getAssetDailyMetrics(position.asset_id)
  const monthlyMetrics = getAssetMonthlyMetrics(position.asset_id)

  return {
    id: position.id,
    accountId: position.account_id,
    assetId: position.asset_id,
    symbol: asset.symbol,
    account: account?.name ?? "Cuenta sin nombre",
    quantity: Number(position.quantity || 0).toLocaleString("es-CL", {
      maximumFractionDigits: 4
    }),
    avgCost: formatCurrency(position.avg_cost, account?.currency ?? asset.currency ?? "USD"),
    totalValue: formatCurrency(totalValue, account?.currency ?? asset.currency ?? "USD"),
    unrealizedPnl: formatCurrency(totalValue - (Number(position.avg_cost || 0) * Number(position.quantity || 0)), account?.currency ?? asset.currency ?? "USD"),
    realizedPnl: formatCurrency(position.realized_pnl, account?.currency ?? asset.currency ?? "USD"),
    totalDividends: formatCurrency(position.total_dividends, account?.currency ?? asset.currency ?? "USD"),
    totalFees: formatCurrency(position.total_fees, account?.currency ?? asset.currency ?? "USD"),
    currentPrice: formatCurrency(currentPrice, account?.currency ?? asset.currency ?? "USD"),
    returnPct: formatPercent(returnPct),
    weight: "Por calcular",
    source: currentPrice ? "Precio de mercado" : "Certificado importado",
    lastTransactionAt: formatDateTime(position.last_transaction_at),
    updatedAt: formatDateTime(position.updated_at),
    name: asset.name,
    type: getAssetTypeLabel(asset.kind),
    market: asset.currency === "USD" ? "Estados Unidos" : "Chile",
    currency: asset.currency,
    asset: {
      ...asset,
      currentPrice: formatCurrency(currentPrice, asset.currency ?? account?.currency ?? "USD"),
      priceSource: currentPrice ? "YahooFinance" : "Certificado importado",
      priceHistory: buildPriceHistory(currentPrice, returnPct),
      dailyMetrics: dailyMetrics
        ? {
            absoluteReturn: formatPercent(dailyMetrics.absolute_return),
            volatility: formatPercent(dailyMetrics.volatility),
            maxDrawdown: formatPercent(dailyMetrics.max_drawdown)
          }
        : null,
      monthlyMetrics: monthlyMetrics
        ? {
            absoluteReturn: "Disponible próximamente",
            beta: Number(monthlyMetrics.beta).toFixed(2)
          }
        : null
    }
  }
}

const getPositionsWithAssets = () => positions_data.map(mapPosition)

const getPositionBySymbol = (symbol) => {
  const normalizedSymbol = decodeURIComponent(symbol).toUpperCase()
  return getPositionsWithAssets().find((position) => position.symbol.toUpperCase() === normalizedSymbol)
}

const getPositionByAssetId = (assetId) => (
  positions_data.find((position) => position.asset_id === assetId)
)

const getPositionDailyMetrics = (positionId) => (
  position_daily_metrics
    .filter((metric) => metric.position_id === positionId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
)

const getPortfolioTrend = () => (
  portfolio_snapshot.map((snapshot) => ({
    label: new Date(snapshot.date).toLocaleDateString("es-CL", { day: "2-digit", month: "short" }),
    value: Number(snapshot.total_value)
  }))
)

const getPortfolioSummary = () => {
  const latest = portfolio_snapshot.at(-1)
  const previous = portfolio_snapshot.at(-2)
  const changePct = previous?.total_value
    ? (Number(latest.total_value) - Number(previous.total_value)) / Number(previous.total_value)
    : 0

  return {
    totalValue: formatCurrency(latest?.total_value, "USD"),
    totalReturn: formatCurrency(latest?.unrealized_pnl, "USD"),
    totalReturnPct: formatPercent(changePct),
    activePositions: positions_data.length.toString(),
    linkedAccounts: accountsStore.length.toString(),
    dataFreshness: `${formatPercent(changePct)} último período`,
    pendingItems: accountsStore.map((account) => account.name).join(" y ")
  }
}

const getAccountDistribution = () => {
  const latest = portfolio_snapshot.at(-1)
  const total = Number(latest?.total_value || 0)

  return accountsStore.map((account) => {
    const amount = Number(latest?.breakdown_by_account?.[account.id] || 0)
    const percentage = total ? (amount / total) * 100 : 0

    return {
      name: account.name,
      value: `${Math.round(percentage)}%`,
      amount: formatCurrency(amount, account.currency),
      change: "Actualizada",
      status: `Registrada el ${new Date(account.created_at).toLocaleDateString("es-CL")}`
    }
  })
}

const getCertificateStatus = () => (
  accountsStore.map((account) => ({
    title: account.name,
    status: "Actualizado",
    detail: new Date(account.created_at).toLocaleDateString("es-CL"),
    tone: "success"
  }))
)

export const handlers = [
  // Para testear
  // Actualmente solo con Assets de tipo Stock
  http.get(`${API_URL}/assets`, () => {
    return HttpResponse.json(asset_data)
  }),

  http.get(`${API_URL}/assets/metrics/daily/:asset_id`, ({ params }) => {
    const { asset_id } = params
    const metric = getAssetDailyMetrics(asset_id)

    if (!metric) {
      return HttpResponse.json(
        { error: "No daily metrics found for this asset", code: "ASSET_DAILY_METRIC_NOT_FOUND" },
        { status: 404 }
      )
    }

    return HttpResponse.json(metric)
  }),

  http.get(`${API_URL}/assets/metrics/monthly/:asset_id`, ({ params }) => {
    const { asset_id } = params
    const metric = getAssetMonthlyMetrics(asset_id)

    if (!metric) {
      return HttpResponse.json(
        { error: "No monthly metrics found for this asset", code: "ASSET_MONTHLY_METRIC_NOT_FOUND" },
        { status: 404 }
      )
    }

    return HttpResponse.json(metric)
  }),

  http.get(`${API_URL}/assets/:asset_id`, ({ params }) => {
    const { asset_id } = params
    const asset = getAssetById(asset_id)

    if (!asset) {
      return HttpResponse.json(
        { error: "Activo no encontrado", code: "ASSET_NOT_FOUND" },
        { status: 404 }
      )
    }

    return HttpResponse.json(asset)
  }),

  // Vista portafolio
  http.get(`${API_URL}/portfolio/dashboard`, () => {
    if (REQUEST_SUCCESSFUL) {
      return HttpResponse.json({
        summary: getPortfolioSummary(),
        accountDistribution: getAccountDistribution(),
        certificateStatus: getCertificateStatus(),
        trend: getPortfolioTrend(),
        positions: getPositionsWithAssets()
      })
    } else {
      return HttpResponse.json(
        { error: "Internal Server Error", code: "ERR_500" },
        { status: 500 }
      )
    }
  }),

  // Vista activos
  http.get(`${API_URL}/positions`, () => {
    if (REQUEST_SUCCESSFUL) {
      return HttpResponse.json({
        positions: getPositionsWithAssets()
      })
    } else {
      return HttpResponse.json(
        { error: "Internal Server Error", code: "ERR_500" },
        { status: 500 }
      )
    }
  }),

  // Vista detalle activo
  http.get(`${API_URL}/positions/asset/:asset_id`, ({ params }) => {
    if (REQUEST_SUCCESSFUL) {
      const { asset_id } = params
      const position = getPositionByAssetId(asset_id)

      if (!position) {
        return HttpResponse.json(
          { error: "Activo no encontrado", code: "POSITION_NOT_FOUND" },
          { status: 404 }
        )
      }

      return HttpResponse.json(position)
    } else {
      return HttpResponse.json(
        { error: "Internal Server Error", code: "ERR_500" },
        { status: 500 }
      )
    }
  }),

  http.get(`${API_URL}/positions/metrics/daily/:position_id`, ({ params }) => {
    if (REQUEST_SUCCESSFUL) {
      const { position_id } = params
      const metric = getPositionDailyMetrics(position_id)[0]

      if (!metric) {
        return HttpResponse.json(
          { error: "No daily metrics found for this position", code: "POSITION_DAILY_METRIC_NOT_FOUND" },
          { status: 404 }
        )
      }

      return HttpResponse.json(metric)
    } else {
      return HttpResponse.json(
        { error: "Internal Server Error", code: "ERR_500" },
        { status: 500 }
      )
    }
  }),

  http.get(`${API_URL}/positions/:symbol`, ({ params }) => {
    if (REQUEST_SUCCESSFUL) {
      const { symbol } = params
      const position = getPositionBySymbol(symbol)

      if (!position) {
        return HttpResponse.json(
          { error: "Activo no encontrado", code: "POSITION_NOT_FOUND" },
          { status: 404 }
        )
      }

      return HttpResponse.json(position)
    } else {
      return HttpResponse.json(
        { error: "Internal Server Error", code: "ERR_500" },
        { status: 500 }
      )
    }
  }),

  http.get(`${API_URL}/warnings`, ({ request }) => {
    if (!REQUEST_SUCCESSFUL) {
      return HttpResponse.json(
        { error: "Internal Server Error", code: "ERR_500" },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const isRead = searchParams.get("is_read")
    const isActive = searchParams.get("is_active")

    const warnings = warningsStore.filter((warning) => {
      const matchesRead = isRead === null || warning.is_read === (isRead === "true")
      const matchesActive = isActive === null || warning.is_active === (isActive === "true")
      return matchesRead && matchesActive
    })

    return HttpResponse.json(warnings)
  }),

  http.patch(`${API_URL}/warnings/:alert_id`, async ({ params, request }) => {
    if (!REQUEST_SUCCESSFUL) {
      return HttpResponse.json(
        { error: "Internal Server Error", code: "ERR_500" },
        { status: 500 }
      )
    }

    const { alert_id } = params
    const payload = await request.json()
    const warning = warningsStore.find((item) => item.id === alert_id)

    if (!warning) {
      return HttpResponse.json(
        { detail: "Warning not found" },
        { status: 404 }
      )
    }

    const updatedWarning = {
      ...warning,
      ...(payload.is_read !== undefined ? { is_read: payload.is_read } : {}),
      ...(payload.is_active !== undefined ? { is_active: payload.is_active } : {})
    }

    warningsStore = warningsStore.map((item) => (
      item.id === alert_id ? updatedWarning : item
    ))

    return HttpResponse.json(updatedWarning)
  }),

  // Vista perfil ===============================================
  // POST /pdf/extract_stocks_etf_1
  http.post(`${API_URL}/pdf/extract_stocks_etf_1`, async ({ request }) => {
    if (USE_REAL_UPLOAD) {
      return passthrough()
    }

    if(REQUEST_SUCCESSFUL){
      return HttpResponse.json({
        success: true,
        message: "Certificado de transacciones procesado y portafolio actualizado con éxito."
      }, { status: 201 }
      )
    }
    else{
      return HttpResponse.json({
        success: false,
        error: "Internal Server Error"
      }, { status: 500 }
      )
    }
  }),
  // POST /pdf/extract_mutual_funds
  http.post(`${API_URL}/pdf/extract_mutual_funds`, async ({ request }) => {
    if (USE_REAL_UPLOAD) {
      return passthrough()
    }

    if(REQUEST_SUCCESSFUL){
      return HttpResponse.json({
        success: true,
        message: "Certificado de transacciones procesado y portafolio actualizado con éxito."
      }, { status: 201 }
      )
    }
    else{
      return HttpResponse.json({
        success: false,
        error: "Internal Server Error"
      }, { status: 500 }
      )
    }
  }),



  // GET /user/accounts_names (obtener nombres de cuentas del usuario)
  http.get(`${API_URL}/user/accounts_names`, ({ params }) => {
    if (REQUEST_SUCCESSFUL) {
      return HttpResponse.json(account_names, {status: 200})
    } else {
      return HttpResponse.json(
        { error: "Internal Server Error", code: "ERR_500" },
        { status: 500 }
      )
    }
  }),

  // Vista Cuentas 
  // GET /accounts/:user_id <-------------
  http.get(`${API_URL}/accounts`, ({ params }) => {
    if (REQUEST_SUCCESSFUL) {
      return HttpResponse.json(accountsStore)
    } else {
      return HttpResponse.json(
        { error: "Internal Server Error", code: "ERR_500" },
        { status: 500 }
      )
    }
  }),

  http.post(`${API_URL}/accounts`, async ({ request }) => {
    if (!REQUEST_SUCCESSFUL) {
      return HttpResponse.json(
        { error: "Internal Server Error", code: "ERR_500" },
        { status: 500 }
      )
    }

    const payload = await request.json()
    const newAccount = {
      id: crypto.randomUUID(),
      user_id: accountsStore[0]?.user_id ?? "e2e-user",
      name: payload.name,
      broker: payload.broker ?? null,
      currency: payload.currency ?? "USD",
      created_at: new Date().toISOString(),
      total_positions: 0,
      stock_count: 0,
      etf_count: 0,
      fund_count: 0
    }

    accountsStore = [newAccount, ...accountsStore]
    return HttpResponse.json(newAccount, { status: 201 })
  }),

  http.get(`${API_URL}/accounts/metrics/:account_id`, ({ params }) => {
    if (REQUEST_SUCCESSFUL) {
      const { account_id } = params
      // Busco las métricas daily de la cuenta específica
      const dailyMetrics = accounts_daily_metrics.filter(metric => metric.account_id === account_id)
      // Busco las métricas monthly de la cuenta específica
      const monthlyMetrics = accounts_monthly_metrics.filter(metric => metric.account_id === account_id)
      return HttpResponse.json({
        daily: dailyMetrics,
        monthly: monthlyMetrics
      })
    } else {
      return HttpResponse.json(
        { error: "Internal Server Error", code: "ERR_500" },
        { status: 500 }
      )
    }
  }),

  http.get(`${API_URL}/accounts/positions/:account_id`, ({ params }) => {
    if (REQUEST_SUCCESSFUL) {
      const { account_id } = params
      const positions = positions_data.filter(position => position.account_id === account_id)      
      return HttpResponse.json({
        positions
      })
    } else {
      return HttpResponse.json(
        { error: "Internal Server Error", code: "ERR_500" },
        { status: 500 }
      )
    }
  }),
  http.get(`${API_URL}/accounts/transactions/:account_id`, ({ params }) => {
    if (REQUEST_SUCCESSFUL) {
      const { account_id } = params
      const transactions = transactions_data.filter(transaction => transaction.account_id === account_id)      
      return HttpResponse.json({
        transactions
      })
    } else {
      return HttpResponse.json(
        { error: "Internal Server Error", code: "ERR_500" },
        { status: 500 }
      )
    }
  }),
  http.get(`${API_URL}/accounts/dividends/:account_id`, ({ params }) => {
    if (REQUEST_SUCCESSFUL) {
      const { account_id } = params
      const dividends = dividends_data.filter(dividend => dividend.account_id === account_id)      
      return HttpResponse.json({
        dividends
      })
    } else {
      return HttpResponse.json(
        { error: "Internal Server Error", code: "ERR_500" },
        { status: 500 }
      )
    }
  }),

  // Vista Cuenta Específica 
  // GET /accounts/:account_id
  // Debe ir despues de las rutas /accounts/metrics, /positions, /transactions y
  // /dividends para no interceptarlas como si "metrics" fuera el id de cuenta.
  http.get(`${API_URL}/accounts/:account_id`, ({ params }) => {
    if (REQUEST_SUCCESSFUL) {
      const { account_id } = params
      const account = accountsStore.find(acc => acc.id === account_id)

      if (!account) {
        return HttpResponse.json(
          { error: "Cuenta no encontrada", code: "ACCOUNT_NOT_FOUND" },
          { status: 404 }
        )
      }

      return HttpResponse.json(account)
    } else {
      return HttpResponse.json(
        { error: "Internal Server Error", code: "ERR_500" },
        { status: 500 }
      )
    }
  }),






  // GET /user/:user_id 
  // Solo para tener el user id
  http.get(`${API_URL}/user/:user_id`, ({ params }) => {
    if (REQUEST_SUCCESSFUL) {
      const { user_id } = params
      
      // Buscamos el usuario si viene en formato array, o retornamos el mock por defecto
      const user = Array.isArray(users_data) 
        ? users_data.find(u => u.id === user_id || u.user_id === user_id) || users_data[0]
        : users_data

      return HttpResponse.json(user)
    } else {
      return HttpResponse.json(
        { error: "Internal Server Error", code: "ERR_500" },
        { status: 500 }
      )
    }
  }),
]
