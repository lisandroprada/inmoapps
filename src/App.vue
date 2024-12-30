<script setup>
import { ref, onMounted } from 'vue'
import Layout from './components/layout/Layout.vue'
import Footer from './components/layout/Footer.vue'
import { useConfigStore } from '@/stores/config'

const configStore = useConfigStore()

// Gestión del modo oscuro
const isDarkMode = ref(false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark', isDarkMode.value)
  localStorage.setItem('darkMode', isDarkMode.value.toString())
}

onMounted(() => {
  configStore.initDarkMode()
  // Recuperar preferencia de modo oscuro
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode) {
    isDarkMode.value = savedDarkMode === 'true'
    document.documentElement.classList.toggle('dark', isDarkMode.value)
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
    <Layout 
      :isDarkMode="isDarkMode" 
      @toggle-dark-mode="toggleDarkMode"
    >
      <main class="container mx-auto px-4 py-8">
        <router-view v-slot="{ Component }">
          <transition 
            name="fade" 
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </Layout>
    
    <Footer />
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
