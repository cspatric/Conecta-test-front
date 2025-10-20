import { createRouter, createWebHistory } from 'vue-router'
import AuthLoginStatic from './Pages/Auth/AuthLoginStatic.vue'
import HomePage from './Pages/Home/HomePage.vue'

function readStoredToken(): string | null {
  const raw = localStorage.getItem('auth_session_v1') || localStorage.getItem('ms_access_token')
  if (!raw) return null
  try {
    if (raw.includes('{')) {
      const parsed = JSON.parse(raw)
      return parsed.msAccessToken || parsed.ms_access_token || null
    }
    return raw
  } catch {
    return raw
  }
}

function persistFromHashOnce() {
  const hash = window.location.hash || ''
  const m = hash.match(/^#session=([^&]+)/)
  if (!m) return
  try {
    const b64url = decodeURIComponent(m[1] ?? '')
    let base = b64url.replace(/-/g, '+').replace(/_/g, '/')
    while (base.length % 4 !== 0) base += '='
    const json = atob(base)
    const data = JSON.parse(json)

    localStorage.setItem('auth_session_v1', JSON.stringify({
      msAccessToken: data.ms_access_token ?? data.msAccessToken ?? data.access_token ?? null,
      tokenMeta: data.token ?? null,
      user: data.me ?? data.user ?? null,
    }))
    if (data.ms_access_token) localStorage.setItem('ms_access_token', data.ms_access_token)
    if (data.me) localStorage.setItem('ms_user', JSON.stringify(data.me))
  } catch (e) {
    console.error('[persistFromHashOnce] erro ao decodificar #session:', e)
  } finally {
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // públicas
    { path: '/login', name: 'login', component: AuthLoginStatic, meta: { public: true } },
    { path: '/auth/callback', name: 'oauth-callback', component: () => import('./Pages/OAuthCallback.vue'), meta: { public: true } },

    // privadas
    { path: '/home', name: 'home', component: HomePage },
    { path: '/mail', name: 'mail', component: () => import('./Pages/Mail/MailIndex.vue') },
    {
      path: '/contacts/:id',
      name: 'contact-details',
      component: () => import('./Pages/Home/ContactDetailsCard.vue'),
      props: route => ({
        contact: route.query && route.query.data ? JSON.parse(decodeURIComponent(String(route.query.data))) : null,
      }),
    },

    { path: '/', redirect: '/login' },
  ],
})

router.beforeEach((to) => {
  persistFromHashOnce()

  const token = readStoredToken()
  const isPublic = to.meta?.public === true

  if (isPublic) {
    if (to.name === 'login' && token) {
      const redirect = (to.query?.redirect as string) || '/home'
      return redirect
    }
    return true
  }

  if (!token) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  return true
})

export default router