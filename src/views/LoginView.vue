<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 relative"
  >
    <!-- Home Icon -->
    <router-link
      to="/"
      class="absolute top-4 left-4 p-2 rounded-full bg-gray-800/70 text-white hover:bg-gray-700 transition"
    >
      <Home class="w-6 h-6" />
    </router-link>

    <!-- Form Box -->
    <div
      class="w-full max-w-md bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-[1.02]"
    >
      <!-- Title -->
      <div class="text-center mb-6">
        <h1 class="text-3xl md:text-4xl font-bold text-white">📝 TodoList</h1>
        <p class="text-gray-400 text-sm md:text-base">Sign in to continue</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-gray-300 mb-2 text-sm md:text-base">Username</label>
          <input
            v-model="username"
            type="text"
            placeholder="Enter username"
            class="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:outline-none transition text-base md:text-lg"
          />
        </div>

        <div>
          <label class="block text-gray-300 mb-2 text-sm md:text-base">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••"
            class="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-base md:text-lg"
          />
        </div>

        <!-- Button -->
        <button
          type="submit"
          class="w-full py-2 md:py-3 rounded-lg bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold shadow-lg transform transition hover:scale-[1.02] hover:shadow-pink-500/40 text-base md:text-lg"
        >
          Login
        </button>
      </form>

      <!-- Register link -->
      <p class="text-gray-400 text-sm md:text-base text-center mt-6">
        Don’t have an account?
        <router-link to="/register" class="text-pink-400 hover:underline">
          Register
        </router-link>
      </p>
    </div>

    <!-- Success Popup -->
    <div
      v-if="showPopup"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    >
      <div
        class="bg-gray-900/90 rounded-2xl shadow-2xl p-8 w-[90%] max-w-sm text-center transform transition"
      >
        <h2 class="text-2xl font-bold text-green-400 mb-4">🎉 Login Successful!</h2>
        <p class="text-gray-300 mb-6">You will be redirected shortly.</p>

        <button
          @click="confirmRedirect"
          class="w-full py-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow-lg hover:scale-[1.02] transition"
        >
          OK ({{ countdown }})
        </button>
      </div>
    </div>

    <!-- Error Popup -->
    <div
      v-if="errorPopup"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    >
      <div
        class="bg-gray-900/90 rounded-2xl shadow-2xl p-8 w-[90%] max-w-sm text-center transform transition"
      >
        <h2 class="text-2xl font-bold text-red-400 mb-4">❌ Login Failed</h2>
        <p class="text-gray-300 mb-6">{{ errorMessage }}</p>

        <button
          @click="errorPopup = false"
          class="w-full py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-[1.02] transition"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Home } from "lucide-vue-next";
import { ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const username = ref("");
const password = ref("");

const showPopup = ref(false);
const countdown = ref(3);
let timer = null;

// error popup
const errorPopup = ref(false);
const errorMessage = ref("");

axios.defaults.baseURL = "http://localhost:5000/api";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const handleLogin = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = "Please fill in both fields!";
    errorPopup.value = true;
    return;
  }

  try {
    const res = await axios.post("/auth/login", {
      username: username.value,
      password: password.value,
    });

    console.log("✅ Login success:", res.data);

  
    if (res.data.token) {
      localStorage.setItem("token", res.data.token); // ✅ เปลี่ยนเป็น "token"
      console.log("✅ Token saved:", res.data.token);
    }
    if (res.data.user) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }

    showPopup.value = true;
    countdown.value = 3;

    timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        confirmRedirect();
      }
    }, 1000);
  } catch (err) {
    console.error("❌ Login error:", err.response?.data || err.message);
    if (err.response?.status === 401) {
      errorMessage.value = "Invalid username or password!";
    } else {
      errorMessage.value = err.response?.data?.message || "Login failed!";
    }
    errorPopup.value = true;
  }
};

const confirmRedirect = () => {
  clearInterval(timer);
  timer = null;
  showPopup.value = false;
  router.push("/main");
};

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>