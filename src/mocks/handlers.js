import { http, HttpResponse } from 'msw'

import asset_data from "./data/asset_actions_mini.json"
 
const API_URL = process.env.NEXT_PUBLIC_URL_BE

export const handlers = [
  http.get(`${API_URL}/assets`, () => {
    console.log("AAAA")
    return HttpResponse.json(asset_data)
  }),
]
