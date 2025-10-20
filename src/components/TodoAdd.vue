<template>
  <div class="bg-gray-800/80 rounded-2xl shadow-xl p-6 w-full max-w-2xl border border-pink-500/20 mx-auto">
    <h2 class="text-xl font-semibold mb-4">Add New Task</h2>

    <div class="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
      <input
        v-model="todoName"
        type="text"
        placeholder="What do you need to do?"
        class="flex-1 bg-gray-900/80 px-4 py-2 rounded-lg outline-none border border-gray-600 focus:ring-2 focus:ring-pink-500"
      />

      
      <button
        @click="showDatePicker = true"
        class="flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 hover:opacity-90 transition text-sm font-semibold shadow-md"
      >
        <span v-if="targetDate">{{ formatDisplayDate(targetDate) }}</span>
        <span v-else>📅 Pick Date</span>
      </button>

      <button
        :disabled="!canAdd"
        @click="submitTodo"
        class="px-6 py-2 rounded-lg font-semibold transition text-white shadow-md"
        :class="canAdd
          ? 'bg-gradient-to-br from-green-500 to-emerald-600 hover:opacity-90'
          : 'bg-gray-600 cursor-not-allowed opacity-50'"
      >
        Add
      </button>
    </div>

    <div v-if="showDatePicker" class="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div class="bg-gray-900 rounded-2xl p-6 w-96 shadow-2xl border border-pink-500/30">
        <h3 class="text-xl font-semibold mb-4 text-center text-pink-400">Select Target Date</h3>
        
       
        <input
          type="date"
          v-model="tempDate"
          
          :min="today"
          class="w-full bg-gray-800 text-white px-3 py-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-pink-500 outline-none"
        />

        <div class="flex justify-end mt-6 space-x-3">
          <button @click="showDatePicker = false" class="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600">
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      todoName: "",
      targetDate: "",
      tempDate: "",
      showDatePicker: false,
      today: "", 
    };
  },
  computed: {
    canAdd() {
      return this.todoName.trim() && this.targetDate;
    },
  },
  methods: {
    formatDisplayDate(dateStr) {
      const d = new Date(dateStr);
      return `${d.getDate()} ${d.toLocaleString("en", { month: "short" })} ${d.getFullYear()}`;
    },

    confirmDate() {
      this.targetDate = this.tempDate;
      this.showDatePicker = false;
    },

    submitTodo() {
      this.$emit("addTodo", {
        name: this.todoName,
        startDate: new Date().toISOString().split("T")[0],
        targetDate: this.targetDate,
        status: "pending",
      });
      this.todoName = "";
      this.targetDate = "";
    },
  },
  mounted() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    this.today = `${y}-${m}-${d}`;
  },
};
</script>
