<script setup>
import { ref } from 'vue'
import Navbar from './Navbar.vue'
import Sidebar from './Sidebar.vue'

const props = defineProps({
  isDarkMode: Boolean
})

const emit = defineEmits(['toggle-dark-mode'])
</script>

<template>
  <div class="flex min-h-screen bg-gray-100 dark:bg-gray-800">
    <Sidebar class="no-print" />
    <div class="flex-1 flex flex-col print-content pl-16">
      <header class="sticky top-0 z-[100] bg-white dark:bg-gray-900 shadow-sm no-print">
        <Navbar 
          :is-dark-mode="isDarkMode"
          @toggle-dark-mode="emit('toggle-dark-mode')"
        />
      </header>
      <main class="flex-1 p-6">
        <slot></slot>
      </main>
    </div>
  </div>
</template>
