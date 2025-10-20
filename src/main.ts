// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css' // TailwindCSS

createApp(App).use(router).mount('#app')