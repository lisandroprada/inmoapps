import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Importar componentes de páginas
import Home from '@/views/Home.vue'
import Simulador from '@/views/Simulador.vue'
import DefinicionUVA from '@/views/DefinicionUVA.vue'
import Graficos from '@/views/Graficos.vue'
import Historial from '@/views/Historial.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import About from '@/views/About.vue'
import ComparativaBancos from '@/views/ComparativaBancos.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/simulador',
    name: 'Simulador',
    component: Simulador,
    meta: { requiresAuth: true }
  },
  {
    path: '/definicion',
    name: 'DefinicionUVA',
    component: DefinicionUVA
  },
  {
    path: '/graficos',
    name: 'Graficos',
    component: Graficos,
    meta: { requiresAuth: true }
  },
  {
    path: '/historial',
    name: 'Historial',
    component: Historial,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginForm,
    meta: { hideForAuth: true }
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/comparativa-bancos',
    name: 'ComparativaBancos',
    component: ComparativaBancos
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

// Guardia de navegación para rutas protegidas
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const hideForAuth = to.matched.some(record => record.meta.hideForAuth)

  // Si la ruta requiere autenticación y el usuario no está autenticado
  if (requiresAuth && !authStore.user) {
    next('/login')
  }
  // Si la ruta es solo para usuarios no autenticados (como login) y el usuario está autenticado
  else if (hideForAuth && authStore.user) {
    next('/')
  }
  // En cualquier otro caso, permitir la navegación
  else {
    next()
  }
})

export default router
