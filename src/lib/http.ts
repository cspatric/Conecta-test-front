import axios from "axios"

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
})

http.interceptors.request.use((config) => {
  const raw = localStorage.getItem("auth_session_v1") || localStorage.getItem("ms_access_token")
  let token: string | null = null

  try {
    if (raw && raw.includes("{")) {
      const parsed = JSON.parse(raw)
      token = parsed.msAccessToken || parsed.ms_access_token || null
    } else {
      token = raw
    }
  } catch {
    token = raw
  }

  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})