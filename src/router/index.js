import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

// Importar componentes de páginas
import Home from '@/views/Home.vue'
import Simulador from '@/views/Simulador.vue'
import DefinicionUVA from '@/views/DefinicionUVA.vue'
import Graficos from '@/views/Graficos.vue'
import Historial from '@/views/Historial.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import About from '@/views/About.vue'
import ComparativaBancos from '@/views/ComparativaBancos.vue'
import Clientes from '@/views/Clientes.vue'

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
    path: '/clientes',
    name: 'Clientes',
    component: Clientes,
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

// Función para esperar a que Firebase inicialice
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener()
        resolve(user)
      },
      reject
    )
  })
}

// Guardia de navegación para rutas protegidas
router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
