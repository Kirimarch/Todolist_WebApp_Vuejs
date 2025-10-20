import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import HomeView from '../views/HomeView.vue';
import RegisterView from '../views/RegisterView.vue';
import TodoView from '../views/TodoView.vue';
const routes = [
  {
  path:"/",
  name: 'Home',
  component: HomeView
}
,
{
  path:"/login",
  name: 'Login',
  component: LoginView
},
{
  path:"/register",
  name: 'Register',
  component: RegisterView
},
{
   path:"/main",
  name: 'Todo',
  component: TodoView
}
];


const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;