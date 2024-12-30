<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { 
  HomeIcon, 
  CalculatorIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  ClockIcon,
  InformationCircleIcon,
  BuildingLibraryIcon,
  UsersIcon,
  Cog6ToothIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const isDrawerOpen = ref(false)
const activeCategory = ref(null)
const activeButtonRef = ref(null)
const drawerPosition = reactive({
  top: '0px',
  bottom: 'auto'
})

const menuItems = [
  { 
    name: 'Principal',
    icon: HomeIcon,
    submenu: [
      { name: 'Inicio', route: '/', icon: HomeIcon },
      { name: 'Definición UVA', route: '/definicion', icon: DocumentTextIcon },
    ]
  },
  {
    name: 'Simulador',
    icon: CalculatorIcon,
    submenu: [
      { name: 'Simulador UVA', route: '/simulador', icon: CalculatorIcon },
    ]
  },
  {
    name: 'Análisis',
    icon: ChartBarIcon,
    submenu: [
      { name: 'Gráficos', route: '/graficos', icon: ChartBarIcon },
      { name: 'Comparativa Bancos', route: '/comparativa-bancos', icon: BuildingLibraryIcon },
      { name: 'Proyecciones', route: '/proyecciones', icon: ChartBarIcon },
    ]
  },
  {
    name: 'Gestión',
    icon: UsersIcon,
    submenu: [
      { name: 'Clientes', route: '/clientes', icon: UsersIcon, requiresAuth: true },
      { name: 'Historial', route: '/historial', icon: ClockIcon, requiresAuth: true },
    ]
  },
  {
    name: 'Info',
    icon: InformationCircleIcon,
    submenu: [
      { name: 'Acerca de', route: '/about', icon: InformationCircleIcon },
    ]
  }
]

const bottomMenuItems = [
  {
    name: 'Configuración',
    icon: Cog6ToothIcon,
    submenu: [
      { name: 'Configuración', route: '/configuracion', icon: Cog6ToothIcon, requiresAuth: true }
    ]
  }
]

const filteredMenuItems = computed(() => {
  return menuItems.map(category => ({
    ...category,
    submenu: category.submenu.filter(item => !item.requiresAuth || (item.requiresAuth && authStore.user))
  })).filter(category => category.submenu.length > 0)
})

const filteredBottomMenuItems = computed(() => {
  return bottomMenuItems.map(category => ({
    ...category,
    submenu: category.submenu.filter(item => !item.requiresAuth || (item.requiresAuth && authStore.user))
  })).filter(category => category.submenu.length > 0)
})

function toggleDrawer(categoryName, event) {
  const button = event.currentTarget
  activeButtonRef.value = button
  const buttonRect = button.getBoundingClientRect()
  const windowHeight = window.innerHeight
  
  // Decidir si renderizar hacia arriba o hacia abajo
  if (buttonRect.top > windowHeight * 0.6) {
    drawerPosition.top = 'auto'
    drawerPosition.bottom = `${windowHeight - buttonRect.top}px`
  } else {
    drawerPosition.top = `${buttonRect.top}px`
    drawerPosition.bottom = 'auto'
  }

  if (activeCategory.value === categoryName) {
    isDrawerOpen.value = false
    activeCategory.value = null
  } else {
    activeCategory.value = categoryName
    isDrawerOpen.value = true
  }
}

function closeDrawer() {
  isDrawerOpen.value = false
  activeCategory.value = null
}

function isActiveRoute(route) {
  return router.currentRoute.value.path === route
}

function getActiveCategory() {
  if (!activeCategory.value) return null
  return [...filteredMenuItems.value, ...filteredBottomMenuItems.value]
    .find(category => category.name === activeCategory.value)
}
</script>

<template>
  <div class="h-screen">
    <!-- Sidebar principal -->
    <nav class="fixed inset-y-0 left-0 w-16 bg-white dark:bg-gray-900 flex flex-col border-r border-gray-200 dark:border-gray-700">
      <!-- Menú principal -->
      <div class="flex-1 py-4">
        <div v-for="category in filteredMenuItems" :key="category.name" class="mb-4">
          <button
            class="w-full p-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white relative group"
            :class="{ 'text-uva-primary-600 dark:text-uva-primary-400': activeCategory === category.name }"
            @click="toggleDrawer(category.name, $event)"
          >
            <component :is="category.icon" class="w-6 h-6 mx-auto" />
            <div class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {{ category.name }}
            </div>
          </button>
        </div>
      </div>

      <!-- Menú inferior -->
      <div class="py-4 border-t border-gray-200 dark:border-gray-700">
        <div v-for="category in filteredBottomMenuItems" :key="category.name">
          <button
            class="w-full p-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white relative group"
            :class="{ 'text-uva-primary-600 dark:text-uva-primary-400': activeCategory === category.name }"
            @click="toggleDrawer(category.name, $event)"
          >
            <component :is="category.icon" class="w-6 h-6 mx-auto" />
            <div class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {{ category.name }}
            </div>
          </button>
        </div>
      </div>
    </nav>

    <!-- Drawer y overlay -->
    <transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      @after-leave="activeCategory = null"
    >
      <div v-if="isDrawerOpen" class="fixed inset-0" style="z-index: 99999;">
        <!-- Overlay con fade -->
        <div 
          class="absolute inset-0 bg-gray-600/50 transition-opacity duration-200" 
          @click="closeDrawer"
        ></div>

        <!-- Panel del drawer -->
        <div 
          class="absolute left-16 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-lg transition-transform duration-200"
          :style="{
            top: drawerPosition.top,
            bottom: drawerPosition.bottom,
            maxHeight: '80vh'
          }"
        >
          <!-- Encabezado simple -->
          <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h2 class="text-sm font-medium text-gray-900 dark:text-white">
                {{ getActiveCategory()?.name }}
              </h2>
              <button
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                @click="closeDrawer"
              >
                <XMarkIcon class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Lista de submenú -->
          <nav class="p-2 overflow-y-auto" :style="{ maxHeight: 'calc(80vh - 3rem)' }">
            <router-link
              v-for="item in getActiveCategory()?.submenu"
              :key="item.route"
              :to="item.route"
              class="flex items-center px-3 py-2 text-sm rounded-md transition-colors mb-1 hover:bg-gray-100 dark:hover:bg-gray-800"
              :class="{
                'bg-uva-primary-50 text-uva-primary-600 dark:bg-gray-800 dark:text-uva-primary-400': isActiveRoute(item.route),
                'text-gray-600 dark:text-gray-300': !isActiveRoute(item.route)
              }"
              @click="closeDrawer"
            >
              <component 
                :is="item.icon" 
                class="w-5 h-5 mr-3"
                :class="{ 'text-uva-primary-600 dark:text-uva-primary-400': isActiveRoute(item.route) }"
              />
              {{ item.name }}
            </router-link>
          </nav>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.router-link-active {
  @apply text-uva-primary-600 dark:text-uva-primary-400 bg-gray-50 dark:bg-gray-800;
}
</style>
