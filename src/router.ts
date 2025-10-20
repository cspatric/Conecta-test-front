import { createRouter, createWebHistory } from 'vue-router'
import AuthLoginStatic from './Pages/Auth/AuthLoginStatic.vue'
import HomePage from './Pages/Home/HomePage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: AuthLoginStatic },
    { path: '/home', name: 'home', component: HomePage },

    {
      path: '/mail',
      name: 'mail',
      component: () => import('./Pages/Mail/MailIndex.vue'),
    },

    { path: '/auth/callback', name: 'oauth-callback', component: () => import('./Pages/OAuthCallback.vue') },

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

export default router