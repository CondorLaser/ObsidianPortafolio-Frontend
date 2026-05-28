import { http, HttpResponse } from 'msw'

import asset_data from "./data/asset_actions_mini.json"

import users_data from "./data/users.json"
import user_profiles from "./data/user_profiles.json"
import accounts_data from "./data/accounts.json"
import accounts_daily_metrics from "./data/metrics/account_daily.json"
import accounts_monthly_metrics from "./data/metrics/account_monthly.json"
import user_preferences from "./data/user_preferences.json"
import positions_data from "./data/positions.json"
import dividends_data from "./data/dividends.json"
import transactions_data from "./data/transactions.json"
 
const API_URL = process.env.NEXT_PUBLIC_URL_BE || ""
const REQUEST_SUCCESSFUL = true

export const handlers = [
  // Para testear
  // Actualmente solo con Assets de tipo Stock
  http.get(`${API_URL}/assets`, () => {
    return HttpResponse.json(asset_data)
  }),

  // Vista perfil
  // POST /upload
  http.post(`${API_URL}/upload`, async ({ request }) => {
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

  // GET /user/risk_profile
  http.get(`${API_URL}/user/risk_profile`, () => {
    if (REQUEST_SUCCESSFUL) {
      return HttpResponse.json(["agressive"])
    } else {
      return HttpResponse.json(
        { error: "Internal Server Error", code: "ERR_500" },
        { status: 500 }
      )
    }
  }),

  // PUT /user/risk_profile
  http.put(`${API_URL}/user/risk_profile`, async ({ request }) => {
    if (REQUEST_SUCCESSFUL) {
      const updatedProfile = await request.json()
      
      // Retornamos el perfil modificado simulando la persistencia
      return HttpResponse.json({
        ...user_profiles,
        ...updatedProfile,
        message: "Perfil de riesgo actualizado correctamente"
      })
    } else {
      return HttpResponse.json(
        { error: "Internal Server Error", code: "ERR_500" },
        { status: 500 }
      )
    }
  }),

  // GET /accounts/:user_id <-------------
  http.get(`${API_URL}/user/accounts_names`, ({ params }) => {
    if (REQUEST_SUCCESSFUL) {
      return HttpResponse.json([
        "Fintual USD",
        "IBKR Trading"
      ])
    } else {
      return HttpResponse.json(
        { error: "Internal Server Error", code: "ERR_500" },
        { status: 500 }
      )
    }
  }),

  // GET /accounts/:user_id <-------------
  http.get(`${API_URL}/accounts`, ({ params }) => {
    if (REQUEST_SUCCESSFUL) {
      return HttpResponse.json(accounts_data)
    } else {
      return HttpResponse.json(
        { error: "Internal Server Error", code: "ERR_500" },
        { status: 500 }
      )
    }
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

  // GET /accounts/:account_id
  // Debe ir despues de las rutas /accounts/metrics, /positions, /transactions y
  // /dividends para no interceptarlas como si "metrics" fuera el id de cuenta.
  http.get(`${API_URL}/accounts/:account_id`, ({ params }) => {
    if (REQUEST_SUCCESSFUL) {
      const { account_id } = params
      const account = accounts_data.find(acc => acc.id === account_id)

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




  // GET /preferences
  http.get(`${API_URL}/preferences`, () => {
    if(REQUEST_SUCCESSFUL){
      return HttpResponse.json(user_preferences[0])
    } else {
      return HttpResponse.json(
        { error: "Internal Server Error", code: "ERR_500" },
        {status: 500}
      )
    }    
  }),

  // PUT /preferences
  http.put(`${API_URL}/preferences`, async ({ request }) => {
    if (REQUEST_SUCCESSFUL) {
      const updatedPreferences = await request.json()
      // Retornamos las preferencias modificadas simulando la persistencia
      return HttpResponse.json({
        ...user_preferences,
        ...updatedPreferences,
        message: "Preferencias del usuario guardadas"
      })
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
