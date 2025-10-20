import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './index.css'

import { i18n } from './i18n'

import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(i18n)
app.use(router)

const auth = useAuthStore()
auth.loadFromStorage()

app.mount('#app')