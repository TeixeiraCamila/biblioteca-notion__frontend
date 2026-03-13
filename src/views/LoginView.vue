<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import Button from '@/components/ui/Button.vue'
const router = useRouter()
const userStore = useUserStore()

const name = ref('')
const email = ref('')
const error = ref('')

// Carrega usuários ao montar
onMounted(async () => {
  try {
    await userStore.fetchAllUsers()
  } catch (err) {
    console.error('Erro ao carregar usuários:', err)
    error.value = 'Erro ao conectar com o servidor. Verifique se o backend está rodando.'
  }
})

// Processa o login quando o botão for clicado
const handleLogin = () => {
  error.value = ''

  const user = userStore.users.find((u) => {
    if (u.type === 'person' && u.person?.email) {
      return (
        u.person.email.toLowerCase() === email.value.toLowerCase() &&
        u.name.toLowerCase() === name.value.toLowerCase()
      )
    }
    return false
  })

  if (user) {
    userStore.setActiveUser(user.id)
    localStorage.setItem('USER_LOGADO', user.id)
    router.push({ name: 'home' })
  } else {
    error.value = 'Usuário não encontrado. Verifique seu nome e email.'
  }
}

// Processa o login como visitante
const handleGuestLogin = () => {
  error.value = ''
  userStore.setGuestUser()
  router.push({ name: 'home' })
};
</script>

<template>
  <div class="login-view__container">
    <div class="login-view__card">
      <h2>Login</h2>

      <form @submit.prevent="handleLogin">
        <div class="login-view__form-group">
          <label for="name">Nome</label>
          <input id="name" v-model="name" type="text" placeholder="Digite seu nome" required />
        </div>

        <div class="login-view__form-group">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" placeholder="Digite seu email" required />
        </div>

        <Button type="submit"><span>Entrar</span></Button>
      </form>

      <div class="login-view__guest-container">
        <Button type="button" class="login-view__guest-btn" @click="handleGuestLogin">
          <span> Entrar como Visitante</span>
        </Button>
      </div>

      <div v-if="error" class="login-view__error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>


<style scoped>
.login-view__container {
  width: 100%;
  max-width: 400px;
  background-image: url('../assets/images/bg-login.webp');
  background-repeat: no-repeat;
  background-size: contain;
  height: 100vh;
  background-position: center;
  display: flex;
  align-items: center;
  position: relative;
  isolation: isolate;
}

.login-view__card {
  transform: rotate(-5deg);
  margin: 0 auto;
}
.login-view__card h2 {
  text-align: center;
  color: var(--black);
  font-size: 28px;
}

.login-view__card form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

.login-view__container button {
  width: 100%;
}

.login-view__error-message {
  margin-top: 20px;
  padding: 12px;
  background: #fee;
  color: #c33;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  width: 227px;
}
</style>
