<template>
  <div class="w-full max-w-2xl mx-auto mt-8">
    <!-- Filter -->
    <div class="flex justify-center space-x-3 mb-6">
      <button
        v-for="f in filters"
        :key="f"
        @click="$emit('filterChange', f)"
        class="px-4 py-1 rounded-lg font-medium shadow-md transition text-sm"
        :class="[activeFilter === f
          ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white'
          : 'bg-gray-700 hover:bg-gray-600 text-gray-300']"
      >
        {{ f }}
      </button>
    </div>

    <!-- Todo List -->
    <div v-if="todos.length" class="space-y-4">
      <div
        v-for="todo in todos"
        :key="todo.id"
        :class="[
          'bg-gray-800/70 border rounded-xl p-4 flex justify-between items-center shadow-md transition',
          todo.status === 'completed'
            ? 'border-gray-600 hover:border-green-400/40'
            : isOverdue(todo.target_date)
            ? 'border-red-500 hover:border-red-400/60'
            : 'border-gray-700 hover:border-pink-500/40'
        ]"
      >
        <div class="flex items-center space-x-3">
          <input
            type="checkbox"
            :checked="todo.status === 'completed'"
            @change="$emit('toggleStatus', todo)"
            class="w-5 h-5 accent-green-500 cursor-pointer"
          />
          <div>
            <p
              :class="{
                'line-through text-gray-400': todo.status === 'completed',
                'text-red-400': isOverdue(todo.target_date) && todo.status === 'pending'
              }"
              class="font-bold text-lg"
            >
              {{ todo.name }}
            </p>
            <p class="text-sm text-gray-400">
              <span class="text-pink-400">Start:</span> {{ formatDisplayDate(todo.start_date) }} |
              <span class="text-blue-400">Target:</span> {{ formatDisplayDate(todo.target_date) }}
              <span
                v-if="isOverdue(todo.target_date) && todo.status === 'pending'"
                class="ml-2 text-red-400 font-semibold"
              >
                ⚠️ Overdue
              </span>
            </p>
          </div>
        </div>

        <div class="flex space-x-2">
          <button
            @click="editTodo(todo)"
            class="px-3 py-1 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 hover:opacity-90 shadow-md text-sm"
          >
            ✏️ Edit
          </button>
          <button
            @click="$emit('deleteTodo', todo.id)"
            class="px-3 py-1 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 hover:opacity-90 shadow-md text-sm"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-400 mt-8">No Todos found ✨</div>

    <!-- Popup Edit -->
    <div v-if="showEditPopup" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div class="bg-gray-900 p-6 rounded-xl w-96 shadow-lg border border-gray-700">
        <h3 class="text-xl font-bold mb-4 text-yellow-400">✏️ Edit Todo</h3>
        <input
          v-model="editData.name"
          class="w-full p-2 mb-3 rounded bg-gray-800 border border-gray-700 text-white"
          placeholder="Todo name"
        />
        <input
          v-model="editData.target_date"
          type="date"
          class="w-full p-2 mb-4 rounded bg-gray-800 border border-gray-700 text-white"
        />
        <div class="flex justify-end space-x-2">
          <button @click="showEditPopup = false" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
            ❌ Cancel
          </button>
          <button
            @click="saveEdit"
            class="px-4 py-2 bg-gradient-to-br from-green-500 to-emerald-600 hover:opacity-90 rounded-lg"
          >
            💾 Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["todos", "activeFilter", "filters"],
  data() {
    return {
      showEditPopup: false,
      editData: {},
    };
  },
  methods: {
    formatDisplayDate(dateStr) {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      return `${d.getDate()} ${d.toLocaleString("en", { month: "short" })} ${d.getFullYear()}`;
    },
    isOverdue(date) {
      const today = new Date().setHours(0, 0, 0, 0);
      const target = new Date(date).setHours(0, 0, 0, 0);
      return target < today;
    },
    editTodo(todo) {
      this.editData = { ...todo, target_date: todo.target_date.split("T")[0] };
      this.showEditPopup = true;
    },

    async saveEdit() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/todos/${this.editData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: this.editData.name,
            target_date: this.editData.target_date,
          }),
        });

        if (!response.ok) throw new Error("Failed to update todo");

       
        const index = this.todos.findIndex(t => t.id === this.editData.id);
        if (index !== -1) {
          this.todos[index].name = this.editData.name;
          this.todos[index].target_date = this.editData.target_date;
        }

        this.showEditPopup = false;

        
        this.$emit("todoUpdated", this.editData);

      } catch (err) {
        console.error("❌ Failed to update:", err);
      }
    },
  },
};
</script>

<style scoped>
.line-through {
  text-decoration-thickness: 2px;
}
</style>
