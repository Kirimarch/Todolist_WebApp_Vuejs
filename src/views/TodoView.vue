<template>
  <div class="todo-container">
    <TodoHeader
      :todos="todos"
      :pendingCount="pendingCount"
      :completedCount="completedCount"
      @logout="confirmLogout"
    />

    <main class="main-content">
      <TodoAdd @addTodo="addTodo" />
      <TodoList
        :todos="filteredTodos"
        :activeFilter="activeFilter"
        :filters="filters"
        @toggleStatus="toggleStatus"
        @deleteTodo="deleteTodo"
        @filterChange="activeFilter = $event"
      />
    </main>

    <!-- Logout Confirm Modal -->
    <div v-if="showLogoutConfirm" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div class="bg-gray-900 rounded-2xl p-6 w-96 shadow-xl border border-red-500/30 text-center">
        <h3 class="text-xl font-semibold text-red-400 mb-3">⚠️ Confirm Logout</h3>
        <p class="text-gray-300 mb-6">Are you sure you want to logout?</p>
        <div class="flex justify-center space-x-4">
          <button
            @click="showLogoutConfirm = false"
            class="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
          >
            Cancel
          </button>
          <button
            @click="startLogoutCountdown"
            class="px-5 py-2 bg-gradient-to-br from-red-500 to-pink-600 hover:opacity-90 rounded-lg text-white shadow-md"
          >
            Yes, Logout
          </button>
        </div>
      </div>
    </div>

    <!-- Logging Out Modal -->
    <div v-if="showCountdown" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div class="bg-gray-900 rounded-2xl p-6 w-96 shadow-xl border border-pink-500/30 text-center">
        <h3 class="text-xl font-bold text-pink-400 mb-4">👋 Logging out...</h3>
        <p class="text-gray-300">Redirecting in {{ countdown }} seconds</p>
      </div>
    </div>
  </div>
</template>

<script>
import TodoHeader from "../components/TodoHeader.vue";
import TodoAdd from "../components/TodoAdd.vue";
import TodoList from "../components/TodoList.vue";
import axios from "axios";

export default {
  name: "TodoView",
  components: { TodoHeader, TodoAdd, TodoList },
  data() {
    return {
      todos: [],
      activeFilter: "All",
      filters: ["All", "Pending", "Completed"],
      showLogoutConfirm: false,
      showCountdown: false,
      countdown: 3,
    };
  },
  computed: {
    pendingCount() {
      return this.todos.filter((t) => t.status === "pending").length;
    },
    completedCount() {
      return this.todos.filter((t) => t.status === "completed").length;
    },
    sortedTodos() {
      return [...this.todos].sort((a, b) => {
        if (a.status !== b.status) return a.status === "pending" ? -1 : 1;
        const aDate = new Date(a.target_date);
        const bDate = new Date(b.target_date);
        if (aDate.getTime() !== bDate.getTime()) return aDate - bDate;
        return new Date(a.created_date) - new Date(b.created_date);
      });
    },
    filteredTodos() {
      if (this.activeFilter === "Pending")
        return this.sortedTodos.filter((t) => t.status === "pending");
      if (this.activeFilter === "Completed")
        return this.sortedTodos.filter((t) => t.status === "completed");
      return this.sortedTodos;
    },
  },
  methods: {
    async fetchTodos() {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.todos = res.data;
    },
    async addTodo(todoData) {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/todos", todoData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.fetchTodos();
    },
    async toggleStatus(todo) {
      const token = localStorage.getItem("token");
      const newStatus = todo.status === "completed" ? "pending" : "completed";
      await axios.patch(
        `http://localhost:5000/api/todos/${todo.id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      this.fetchTodos();
    },
    async deleteTodo(id) {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.fetchTodos();
    },

    // ✅ เรียกเมื่อกดปุ่ม Logout
    confirmLogout() {
      this.showLogoutConfirm = true;
    },

    // ✅ เมื่อยืนยัน logout
    startLogoutCountdown() {
      this.showLogoutConfirm = false;
      this.showCountdown = true;
      this.countdown = 2;

      const interval = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(interval);
          this.logout();
        }
      }, 1000);
    },

    // ✅ logout จริง
    logout() {
      localStorage.removeItem("token");
      this.showCountdown = false;
      this.$router.push("/login");
    },
  },
  mounted() {
    this.fetchTodos();
  },
};
</script>

<style scoped>
.todo-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom right, #111827, #1f2937, #111827);
  color: white;
  overflow: hidden;
}

::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #ec4899, #8b5cf6);
  border-radius: 10px;
}
::-webkit-scrollbar-track {
  background: #1f2937;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  scrollbar-color: #ec4899 #1f2937;
  scrollbar-width: thin;
}
</style>
