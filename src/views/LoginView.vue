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
    <div class="div div__front"></div>

    <div class="login-view__content">
      <h2 class="login-view__title">Login</h2>

      <form @submit.prevent="handleLogin">
        <div class="login-view__form-group">
          <label for="name" class="login-view__label">Nome</label>
          <input id="name" v-model="name" type="text" class="login-view__input" placeholder="seu nome" required />
        </div>

        <div class="login-view__form-group">
          <label for="email" class="login-view__label">Email</label>
          <input id="email" v-model="email" type="email" class="login-view__input" placeholder="seu@email.com"
            required />
        </div>

        <Button type="submit" class="login-view__button">
          <span>Entrar</span>
        </Button>
      </form>

      <div class="login-view__guest-container">
        <Button type="button" class="login-view__guest-btn" @click="handleGuestLogin">
          <span>Entrar como Visitante</span>
        </Button>
      </div>

      <div v-if="error" class="login-view__error-message">
        {{ error }}
      </div>
    </div>
    <div class="div div__back"></div>
  </div>
</template>


<style>
.app__view.app__main-content--login {
  background: var(--accent5_muted);
   overflow: hidden;
   align-items: flex-start;
  padding-top: 2rem;
  /* height: 70vh;
  align-items: flex-end;
  */
}
</style>

<style scoped>
.login-view__container {
  position: relative;
}

.login-view__content {
  color: var(--black);
  background: var(--white);
  padding: 2.5rem;
  position: relative;
  z-index: 2;
  animation: slideDown 2.5s forwards;
  max-width: 400px;
  width: 100%;
}

.login-view__container button {
  width: 100%;
}

.login-view__container h2 {
  margin-bottom: 1rem;
  text-align: center;
}

.login-view__container form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.div {
  height: 100px;
  width: 500px;
  border-radius: var(--radius);
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background: var(--black);
}

.div__back {
  z-index: 1;
}

.div__front {
  z-index: 3;
  top: -20px;
}

@keyframes slideDown {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  20% {
    opacity: 0;
  }

  100% {
    transform: translateY(50px);
    opacity: 1;
  }

}
</style>
