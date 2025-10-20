<script setup lang="ts">
import { onMounted } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "../stores/auth"

const router = useRouter()
const auth = useAuthStore()

function decodeSessionFromHash() {
  const hash = window.location.hash || ""
  const m = hash.match(/^#session=([^&]+)/)
  if (!m) return null
  try {
    const b64 = decodeURIComponent(m[1])
    let base = b64.replace(/-/g, "+").replace(/_/g, "/")
    while (base.length % 4 !== 0) base += "="
    const json = atob(base)
    return JSON.parse(json)
  } catch {
    return null
  }
}

onMounted(async () => {
  const data = decodeSessionFromHash()
  if (data && data.ms_access_token && data.me) {
    if (auth.setSessionFromFrontend) {
      auth.setSessionFromFrontend({
        user: data.me,
        token: data.ms_access_token,
        meta: data.token ?? null,
      })
    } else {
      localStorage.setItem("auth_session_v1", JSON.stringify({
        user: data.me,
        msAccessToken: data.ms_access_token,
        tokenMeta: data.token ?? null,
      }))
      localStorage.setItem("ms_access_token", data.ms_access_token)
      localStorage.setItem("ms_user", JSON.stringify(data.me))
    }
    history.replaceState(null, "", window.location.pathname + window.location.search)
    router.replace({ name: "home" })
    return
  }
  router.replace({ name: "login", query: { err: "oauth" } })
})
</script>

<template>
  <div class="min-h-screen grid place-items-center bg-gray-950 text-white">
    <div class="p-6 rounded-xl bg-gray-900">
      <p>Conectando…</p>
    </div>
  </div>
</template>