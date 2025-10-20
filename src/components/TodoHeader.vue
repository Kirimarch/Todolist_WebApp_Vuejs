<template>
  <header class="flex flex-wrap justify-between items-center px-6 py-4 shadow-lg bg-gray-800/60 backdrop-blur-md">
    <h1 class="text-2xl font-bold tracking-wide text-pink-400">✨ My Todo</h1>

    <div class="flex items-center space-x-5 text-sm sm:text-base">
      <div class="flex items-center space-x-1 text-gray-300">
        <span>📋</span>
        <span>Total: <span class="text-white font-semibold">{{ todos.length }}</span></span>
      </div>
      <div class="flex items-center space-x-1 text-yellow-400">
        <span>⏳</span>
        <span>Pending: <span class="font-semibold">{{ pendingCount }}</span></span>
      </div>
      <div class="flex items-center space-x-1 text-green-400">
        <span>✅</span>
        <span>Completed: <span class="font-semibold">{{ completedCount }}</span></span>
      </div>
    </div>

    <button
      @click="$emit('logout')"
      class="px-4 py-2 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 hover:opacity-90 shadow-md mt-3 sm:mt-0"
    >
      Logout
    </button>
  </header>
</template>

<script>
export default {
  props: ["todos", "pendingCount", "completedCount"],
};
</script>
