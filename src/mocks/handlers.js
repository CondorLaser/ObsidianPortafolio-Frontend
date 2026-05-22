import { http, HttpResponse } from 'msw'

import asset_data from "./data/asset_actions_mini.json"

import users_data from "./data/users.json"
import user_profiles from "./data/user_profiles.json"
import accounts_data from "./data/accounts.json"
import user_preferences from "./data/user_preferences.json"
 
const API_URL = process.env.NEXT_PUBLIC_URL_BE

export const handlers = [
  // Para testear
  // Actualmente solo con Assets de tipo Stock
  http.get(`${API_URL}/assets`, () => {
    return HttpResponse.json(asset_data)
  }),



  // Vista perfil
  // POST /upload
  http.post(`${API_URL}/upload`, async ({ request }) => {
    return HttpResponse.json({
      success: true,
      message: "Certificado de transacciones procesado y portafolio actualizado con éxito."
    }, { status: 201 })
  }),
  /* http.post(`${API_URL}/upload`, async ({ request }) => {
    return HttpResponse.json({
      success: false,
      message: "Error."
    }, { status: 500 })
  }), */
  // GET /user/risk_profile
  http.get(`${API_URL}/user/risk_profile`, () => {
    return HttpResponse.json(user_profiles)
  }),
  // PUT /user/risk_profile
  http.put(`${API_URL}/user/risk_profile`, async ({ request }) => {
    const updatedProfile = await request.json()
    
    // Retornamos el perfil modificado simulando la persistencia
    return HttpResponse.json({
      ...user_profiles,
      ...updatedProfile,
      message: "Perfil de riesgo actualizado correctamente"
    })
  }),
  // GET /accounts/:user_id <-------------
  http.get(`${API_URL}/user/accounts`, () => {
    return HttpResponse.json([
      "Fintual USD",
      "IBKR Trading"
    ])
  }),
  // GET /preferences
  http.get(`${API_URL}/preferences`, () => {
    return HttpResponse.json(user_preferences)
  }),
  // PUT /preferences
  http.put(`${API_URL}/preferences`, async ({ request }) => {
    const updatedPreferences = await request.json()
    
    // Retornamos las preferencias modificadas simulando la persistencia
    return HttpResponse.json({
      ...user_preferences,
      ...updatedPreferences,
      message: "Preferencias del usuario guardadas"
    })
  }),

  // GET /user/:user_id 
  // Solo para tener el user id
  http.get(`${API_URL}/user/:user_id`, ({ params }) => {
    const { user_id } = params
    
    // Buscamos el usuario si viene en formato array, o retornamos el mock por defecto
    const user = Array.isArray(users_data) 
      ? users_data.find(u => u.id === user_id || u.user_id === user_id) || users_data[0]
      : users_data

    return HttpResponse.json(user)
  }),
]
