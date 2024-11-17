import { createRouter, createWebHistory } from 'vue-router'

// Importar componentes de páginas
import Home from '../views/Home.vue'
import Simulador from '../views/Simulador.vue'
import DefinicionUVA from '../views/DefinicionUVA.vue'
import Graficos from '../views/Graficos.vue'
import Historial from '../views/Historial.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/simulador',
    name: 'Simulador',
    component: Simulador
  },
  {
    path: '/definicion',
    name: 'DefinicionUVA',
    component: DefinicionUVA
  },
  {
    path: '/graficos',
    name: 'Graficos',
    component: Graficos
  },
  {
    path: '/historial',
    name: 'Historial',
    component: Historial
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
