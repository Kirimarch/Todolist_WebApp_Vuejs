<template>
  <div
    class="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 relative"
  >
    <div
      class="w-full max-w-md bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 text-center transform transition-all hover:scale-[1.02]"
    >
      <h1 class="font-bold text-white mb-4 text-[clamp(1.8rem,5vw,2.5rem)]">
        📝 TodoList
      </h1>
      <p class="text-gray-400 mb-8 text-[clamp(0.9rem,2.5vw,1.1rem)]">
        Welcome to your productivity hub
      </p>

      <div class="space-y-4">
        <router-link
          to="/login"
          class="block w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold shadow-lg transform transition hover:scale-[1.02] hover:shadow-pink-500/40 text-[clamp(1rem,2.5vw,1.2rem)]"
        >
          Login
        </router-link>

        <router-link
          to="/register"
          class="block w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg transform transition hover:scale-[1.02] hover:shadow-blue-500/40 text-[clamp(1rem,2.5vw,1.2rem)]"
        >
          Register
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Home } from "lucide-vue-next";
</script>
