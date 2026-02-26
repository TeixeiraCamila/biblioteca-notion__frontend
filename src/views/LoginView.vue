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

        <button type="submit">Entrar</button>
      </form>

      <div v-if="error" class="login-view__error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { useUserStore } from '@/stores/userStore'

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
};
</script>

<style scoped>
.login-view__container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background-image: url('../assets/images/bg-login.webp');
  background-repeat: no-repeat;
  background-size: contain;
  height: 100vh;
  background-position: center;
  display: flex;
  align-items: center;
}

.login-view__card {
  padding: 40px;
  transform: rotate(-5deg);
  margin-left: 25px;
}

.login-view__card h2 {
  margin: 0 0 30px 0;
  text-align: center;
  color: #333;
  font-size: 28px;
}

.login-view__form-group {
  margin-bottom: 20px;
}

.login-view__form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
  font-size: 14px;
}

.login-view__form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 0;
  outline: 0;
  background: transparent;
  border-bottom: 2px solid var(--accent_muted);
  border-left: 2px solid var(--accent_muted);
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.login-view__form-group input:focus {
  outline: none;
  border-color: var(--accent);
}

.login-view__card button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.login-view__card button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px var(--accent_muted);
}

.login-view__error-message {
  margin-top: 20px;
  padding: 12px;
  background: #fee;
  color: #c33;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
}
</style>
