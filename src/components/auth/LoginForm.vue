<template>
  <div class="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
      {{ isLogin ? 'Iniciar Sesión' : 'Registrarse' }}
    </h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <input
          v-model="email"
          type="email"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        >
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Contraseña
        </label>
        <input
          v-model="password"
          type="password"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        >
      </div>

      <div v-if="authStore.error" class="text-red-500 text-sm">
        {{ authStore.error }}
      </div>

      <button
        type="submit"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {{ isLogin ? 'Iniciar Sesión' : 'Registrarse' }}
      </button>

      <div class="text-center mt-4">
        <button
          type="button"
          @click="isLogin = !isLogin"
          class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          {{ isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const isLogin = ref(true)

async function handleSubmit() {
  try {
    if (isLogin.value) {
      await authStore.login(email.value, password.value)
    } else {
      await authStore.register(email.value, password.value)
    }
    router.push('/') // Redirige al home después del login exitoso
  } catch (error) {
    console.error('Error de autenticación:', error)
  }
}
</script>
