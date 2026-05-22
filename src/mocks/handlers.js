import { http, HttpResponse } from 'msw'

import asset_data from "./data/asset_actions_mini.json"

import users_data from "./data/users.json"
import user_profiles from "./data/user_profiles.json"
import accounts_data from "./data/accounts.json"
import user_preferences from "./data/user_preferences.json"
 
const API_URL = process.env.NEXT_PUBLIC_URL_BE
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
      return HttpResponse.json(user_profiles)
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
  http.get(`${API_URL}/accounts/:user_id`, ({ params }) => {
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
