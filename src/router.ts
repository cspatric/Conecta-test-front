// src/router.ts
import { createRouter, createWebHistory } from 'vue-router'
import AuthLoginStatic from './Pages/Auth/AuthLoginStatic.vue'
import HomePage from './Pages/Home/HomePage.vue' // 👈 importa a Home

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: AuthLoginStatic,
    },
    {
      path: '/home',            // 👈 nova rota Home
      name: 'home',
      component: HomePage,
    },
    {
      path: '/',
      redirect: '/login',
    },
  ],
})

export default router