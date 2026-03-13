/*04
  O que faz: Define rotas (URLs) e qual componente mostrar
*/
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

import CreateBookView from '../views/CreateBookView.vue'
import LoginView from '@/views/LoginView.vue'
import CardStackView from '@/views/CardStackView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      name: 'home',
      component: CardStackView,
      meta: { requiresAuth: true },
    },
    {
      path: '/criar',
      name: 'create',
      component: CreateBookView,
      meta: { requiresAuth: true },
    },
    {
      path: '/editar/:id',
      name: 'edit',
      component: CreateBookView,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const saved = localStorage.getItem('USER_LOGADO')
  const isGuest = localStorage.getItem('IS_GUEST') === 'true'

  // Verifica se é usuário visitante
  if (isGuest && saved === 'guest') {
    userStore.checkIfGuest()
  } else if (saved) {
    userStore.userActive = saved
  }

  const requiresAuth = to.meta.requiresAuth
  const isAuthenticated = userStore.userActive !== null || userStore.isGuest

  // precisa de autenticação e o usuário não está logado
  if (requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  }

  // se o usuário está logado e tenta acessar o login
  else if (to.name === 'login' && isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router

/*
Exemplos de uso:

<!-- Em templates -->
<router-link to="/">Home</router-link>
<router-link to="/criar">Criar</router-link>
<router-link to="/login">Login</router-link>

<!-- Programaticamente -->
<script>
import { useRouter } from 'vue-router';
const router = useRouter();
router.push('/');        // Navega para home
router.push('/criar');   // Navega para criar
router.push('/login');   // Navega para login
</script>

<!-- Logout -->
<script>
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const logout = () => {
  userStore.clearActiveUser();
  router.push('/login');
};
</script>
*/
