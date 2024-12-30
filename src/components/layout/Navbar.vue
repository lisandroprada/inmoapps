<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import {
    CalculatorIcon,
    SunIcon,
    MoonIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
} from "@heroicons/vue/24/outline";

const router = useRouter();
const authStore = useAuthStore();
const props = defineProps({
    isDarkMode: Boolean,
});
const emit = defineEmits(["toggle-dark-mode"]);

const isUserMenuOpen = ref(false);

async function handleLogout() {
    try {
        await authStore.logout();
        router.push("/login");
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
}

function toggleUserMenu() {
    isUserMenuOpen.value = !isUserMenuOpen.value;
}

function closeUserMenu() {
    isUserMenuOpen.value = false;
}
</script>

<template>
    <nav
        class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 transition-all duration-200 ease-in-out pl-16"
    >
        <div
            class="container mx-auto px-4 py-3 flex justify-between items-center"
        >
            <div class="flex items-center space-x-4">
                <CalculatorIcon
                    class="h-8 w-8 text-uva-primary-600 dark:text-uva-primary-300"
                />
                <h1
                    class="text-xl font-bold text-uva-primary-600 dark:text-uva-primary-300"
                >
                    Simulador Créditos UVA
                </h1>
            </div>

            <div class="flex items-center space-x-4 relative">
                <button
                    @click="emit('toggle-dark-mode')"
                    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <SunIcon
                        v-if="isDarkMode"
                        class="h-6 w-6 text-gray-700 dark:text-gray-300"
                    />
                    <MoonIcon
                        v-else
                        class="h-6 w-6 text-gray-700 dark:text-gray-300"
                    />
                </button>

                <template v-if="authStore.user">
                    <div class="relative">
                        <button
                            @click="toggleUserMenu"
                            class="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-uva-primary-600 dark:hover:text-uva-primary-300"
                        >
                            <UserCircleIcon class="h-6 w-6" />
                            <span class="text-sm">{{
                                authStore.user.email
                            }}</span>
                        </button>
                        <transition
                            enter-active-class="transition ease-out duration-100"
                            enter-from-class="transform opacity-0 scale-95"
                            enter-to-class="transform opacity-100 scale-100"
                            leave-active-class="transition ease-in duration-75"
                            leave-from-class="transform opacity-100 scale-100"
                            leave-to-class="transform opacity-0 scale-95"
                        >
                            <div
                                v-if="isUserMenuOpen"
                                class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 z-20"
                            >
                                <router-link
                                    to="/configuracion"
                                    class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    @click="closeUserMenu"
                                >
                                    <Cog6ToothIcon class="h-5 w-5 mr-2" />
                                    Configuración
                                </router-link>
                                <button
                                    @click="handleLogout"
                                    class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <ArrowRightOnRectangleIcon
                                        class="h-5 w-5 mr-2"
                                    />
                                    Cerrar Sesión
                                </button>
                            </div>
                        </transition>
                    </div>
                </template>
                <template v-else>
                    <router-link
                        to="/login"
                        class="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-uva-primary-600 dark:hover:text-uva-primary-300"
                    >
                        <UserCircleIcon class="h-6 w-6" />
                        <span>Iniciar Sesión</span>
                    </router-link>
                </template>
            </div>
        </div>
    </nav>
</template>
