<template>
  <div class="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col relative">
    <!-- Header -->
    <header class="flex justify-between items-center px-6 py-4 shadow-lg bg-gray-800/60 backdrop-blur-md">
      <h1 class="text-2xl font-bold tracking-wide text-pink-400">✨ My Todos</h1>
      <button
        @click="showLogoutConfirm = true"
        class="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 hover:opacity-90 shadow-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="white">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15 12H3m12 0l-4-4m4 4l-4 4m10-8v8a2 2 0 01-2 2h-4" />
        </svg>
        <span class="hidden sm:block font-medium">Logout</span>
      </button>
    </header>

    <!-- Main -->
    <main class="flex-1 flex flex-col items-center px-4 py-6 sm:px-6 sm:py-8 overflow-y-auto">
      <!-- Todo Input Card -->
      <div class="bg-gray-800/80 rounded-2xl shadow-xl p-6 w-full max-w-2xl border border-pink-500/20">
        <h2 class="text-xl font-semibold mb-4">Add New Task</h2>

        <div class="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
          <input
            v-model="todoName"
            type="text"
            placeholder="What do you need to do?"
            class="flex-1 bg-gray-900/80 px-4 py-2 rounded-lg outline-none border border-gray-600 focus:ring-2 focus:ring-pink-500"
          />

          <!-- Calendar Button -->
          <button
            @click="showDatePicker = true"
            class="flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 hover:opacity-90 transition text-sm font-semibold shadow-md"
          >
            <span v-if="targetDate">
              {{ formatDay(targetDate) }} {{ formatMonth(targetDate) }}
            </span>
            <span v-else>📅 Pick Date</span>
          </button>

          <!-- Add Button -->
          <button
            :disabled="!canAdd"
            @click="addTodo"
            class="px-6 py-2 rounded-lg font-semibold transition text-white shadow-md"
            :class="canAdd
              ? 'bg-gradient-to-br from-green-500 to-emerald-600 hover:opacity-90'
              : 'bg-gray-600 cursor-not-allowed opacity-50'
            "
          >
            Add
          </button>
        </div>
      </div>

      <!-- Todo List -->
      <div class="mt-8 w-full max-w-2xl">
        <h2 class="text-lg font-semibold mb-4">Your Todos</h2>
        <div class="space-y-4">
          <div
            v-for="(todo, index) in todos"
            :key="index"
            class="bg-gray-800/70 border border-gray-700 rounded-xl p-4 flex justify-between items-center shadow-md hover:border-pink-500/40 transition"
          >
            <div>
              <p class="font-bold text-lg">{{ todo.name }}</p>
              <p class="text-sm text-gray-400">
                <span class="text-pink-400">Start:</span>
                {{ formatFullDate(todo.start_date) }}
                |
                <span class="text-blue-400">Target:</span>
                {{ formatFullDate(todo.target_date) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Popup Date Picker -->
    <div
      v-if="showDatePicker"
      class="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
    >
      <div class="bg-gray-900 rounded-2xl p-6 w-96 shadow-2xl border border-pink-500/30">
        <h3 class="text-xl font-semibold mb-4 text-center text-pink-400">Select Target Date</h3>
        <input
          type="date"
          v-model="tempDate"
          class="w-full bg-gray-800 text-white px-3 py-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-pink-500 outline-none"
        />
        <div class="flex justify-end mt-6 space-x-3">
          <button
            @click="showDatePicker = false"
            class="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            @click="confirmDate"
            class="px-5 py-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 hover:opacity-90 text-white shadow-md"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>

    <!-- Popup Logout -->
    <div
      v-if="showLogoutConfirm"
      class="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
    >
      <div class="bg-gray-900 rounded-2xl p-6 w-80 shadow-2xl border border-red-500/30">
        <h3 class="text-lg font-semibold text-center text-red-400 mb-4">
          คุณต้องการออกจากระบบหรือไม่?
        </h3>
        <div class="flex justify-end space-x-3">
          <button
            @click="showLogoutConfirm = false"
            class="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
          >
            ยกเลิก
          </button>
          <button
            @click="logout"
            class="px-5 py-2 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 hover:opacity-90 text-white shadow-md"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "TodoView",
  data() {
    return {
      todoName: "",
      targetDate: "",
      tempDate: "",
      showDatePicker: false,
      showLogoutConfirm: false,
      todos: [],
    };
  },
  computed: {
    canAdd() {
      return this.todoName.trim() !== "" && this.targetDate !== "";
    },
  },
  methods: {
    formatDay(date) {
      return new Date(date).getDate();
    },
    formatMonth(date) {
      return new Date(date).toLocaleString("en", { month: "short" });
    },
    formatFullDate(date) {
      return new Date(date).toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
    confirmDate() {
      this.targetDate = this.tempDate;
      this.showDatePicker = false;
    },
    async addTodo() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await axios.post(
            "http://localhost:5000/api/todos",
            {
              name: this.todoName,
              startDate: new Date().toISOString().split("T")[0],
              targetDate: this.targetDate,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          this.fetchTodos();
        } catch (err) {
          console.error("API add error:", err.message);
        }
      }
      this.todoName = "";
      this.targetDate = "";
    },
    async fetchTodos() {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5000/api/todos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.todos = res.data;
      } catch (err) {
        console.error("API fetch error:", err.message);
      }
    },
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
  },
  mounted() {
    this.fetchTodos();
  },
};
</script>
