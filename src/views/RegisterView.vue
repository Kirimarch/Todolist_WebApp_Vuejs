<template>
  <div
    class="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 relative"
  >
    <router-link
      to="/"
      class="absolute top-4 left-4 p-2 rounded-full bg-gray-800/70 text-white hover:bg-gray-700 transition"
    >
      <Home class="w-6 h-6" />
    </router-link>

    <!-- Register Form -->
    <div
      class="w-full max-w-md bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-[1.02]"
    >
      <h1
        class="text-center font-bold text-white mb-6 text-[clamp(1.8rem,5vw,2.5rem)]"
      >
        Create Account
      </h1>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <input
          v-model="username"
          type="text"
          placeholder="Username"
          class="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 
                 focus:ring-2 focus:outline-none transition text-[clamp(0.9rem,2.5vw,1rem)] focus:ring-blue-500"
        />
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 
                 focus:ring-2 focus:outline-none transition text-[clamp(0.9rem,2.5vw,1rem)] focus:ring-blue-500"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 
                 focus:ring-2 focus:outline-none transition text-[clamp(0.9rem,2.5vw,1rem)] focus:ring-blue-500"
        />
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          class="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 
                 focus:ring-2 focus:outline-none transition text-[clamp(0.9rem,2.5vw,1rem)] focus:ring-blue-500"
        />

        <button
          type="submit"
          class="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 
                 text-white font-semibold shadow-lg transform transition 
                 hover:scale-[1.02] hover:shadow-blue-500/40 text-[clamp(1rem,2.5vw,1.2rem)]"
        >
          Register
        </button>
      </form>

      <p class="mt-6 text-center text-gray-400 text-[clamp(0.8rem,2vw,1rem)]">
        Already have an account?
        <router-link to="/login" class="text-blue-400 hover:underline">
          Login
        </router-link>
      </p>
    </div>

    <!-- Modal -->
    <div
      v-if="showMessage"
      class="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
    >
      <div
        class="bg-gradient-to-br from-green-500/90 via-blue-500/90 to-purple-600/90 text-white 
               rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-popup"
      >
        <h2 class="text-2xl font-bold mb-2 flex justify-center items-center gap-2">
           {{ messageTitle }}
        </h2>
        <p class="text-sm opacity-90 mb-5">{{ messageBody }}</p>

        <button
          @click="confirmRedirect"
          class="w-full py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-blue-500 
                 hover:opacity-90 text-white font-semibold shadow-md transition-all duration-300"
        >
          OK ({{ countdown }})
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from "vue";
import { Home } from "lucide-vue-next";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const showMessage = ref(false);
const messageTitle = ref("");
const messageBody = ref("");
const countdown = ref(3);
let timer = null;

// ✅ Handle Register
const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    messageTitle.value = "⚠️ Passwords do not match!";
    messageBody.value = "Please check your passwords again.";
    showMessage.value = true;
    return;
  }

  try {
    const res = await axios.post("http://localhost:5000/api/auth/register", {
      username: username.value,
      email: email.value,
      password: password.value,
    });

    messageTitle.value = "🎉 Registration Successful!";
    messageBody.value = "You will be redirected to the home page shortly.";
    showMessage.value = true;
    countdown.value = 4;

    timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) confirmRedirect();
    }, 1000);

    username.value = "";
    email.value = "";
    password.value = "";
    confirmPassword.value = "";
  } catch (err) {
    messageTitle.value = "❌ Registration Failed!";
    messageBody.value = err.response?.data?.message || "Something went wrong.";
    showMessage.value = true;
  }
};

// ✅ Redirect
const confirmRedirect = () => {
  clearInterval(timer);
  showMessage.value = false;
  router.push("/");
};

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
@keyframes popup {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  60% {
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-popup {
  animation: popup 0.3s ease-out;
}
</style>
