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
const showTypewriter = ref(false)
const showPaper = ref(false)

// Carrega usuários ao montar
onMounted(async () => {
  try {
    // Inicia animações de entrada
    setTimeout(() => {
      showTypewriter.value = true
    }, 100)
    
    setTimeout(() => {
      showPaper.value = true
    }, 800)
    
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
    <!-- Máquina de escrever -->
    <div class="typewriter-container" :class="{ 'typewriter-enter': showTypewriter }">
      <div class="typewriter">
        <!-- Base da máquina -->
        <div class="typewriter__base">
          <div class="typewriter__body">
            <!-- Topo da máquina -->
            <div class="typewriter__top">
              <div class="typewriter__roller-left"></div>
              <div class="typewriter__roller-right"></div>
            </div>

            <!-- Papel saindo da máquina -->
            <div class="typewriter__paper-slot">
              <div class="paper" :class="{ 'paper-enter': showPaper }">
                <!-- Cabeçalho do papel -->
                <div class="paper__header">
                  <span class="paper__date">omont.2020</span>
                  <span class="paper__title">boring office</span>
                </div>

                <!-- Conteúdo do papel (formulário) -->
                <div class="paper__content">
                  <form @submit.prevent="handleLogin">
                    <div class="paper__form-group">
                      <label for="name" class="paper__label">Nome</label>
                      <input
                        id="name"
                        v-model="name"
                        type="text"
                        class="paper__input"
                        placeholder="seu nome"
                        required
                      />
                    </div>

                    <div class="paper__form-group">
                      <label for="email" class="paper__label">Email</label>
                      <input
                        id="email"
                        v-model="email"
                        type="email"
                        class="paper__input"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>

                    <Button type="submit" class="paper__button">
                      <span>Entrar</span>
                    </Button>
                  </form>

                  <div class="paper__guest-container">
                    <Button type="button" class="paper__guest-btn" @click="handleGuestLogin">
                      <span>Entrar como Visitante</span>
                    </Button>
                  </div>

                  <div v-if="error" class="paper__error-message">
                    {{ error }}
                  </div>
                </div>

                <!-- Rodapé do papel -->
                <div class="paper__footer">
                  <span class="paper__footer-title">boring office</span>
                  <div class="paper__footer-line"></div>
                  <span class="paper__footer-text">old memory of new time ....</span>
                </div>
              </div>
            </div>

            <!-- Teclado -->
            <div class="typewriter__keyboard">
              <div class="typewriter__keys">
                <div
                  v-for="i in 11"
                  :key="i"
                  class="typewriter__key"
                  :style="{ '--key-index': i }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Container principal */
.login-view__container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f1e8 0%, #e8dcc8 100%);
  overflow: hidden;
  perspective: 1000px;
}

/* Container da máquina de escrever */
.typewriter-container {
  opacity: 0;
  transform: translateY(50px) rotateX(10deg) scale(0.8);
  transition: all 1s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.typewriter-container.typewriter-enter {
  opacity: 1;
  transform: translateY(0) rotateX(0) scale(1);
}

/* Máquina de escrever */
.typewriter {
  position: relative;
  width: 600px;
  height: 450px;
  filter: drop-shadow(0 20px 60px rgba(0, 0, 0, 0.3));
}

.typewriter__base {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #d4c5a0 0%, #c9b89a 50%, #b8a68a 100%);
  border-radius: 20px;
  padding: 30px;
  box-shadow: inset -5px -5px 15px rgba(0, 0, 0, 0.2), inset 5px 5px 15px rgba(255, 255, 255, 0.3);
  display: flex;
  flex-direction: column;
  position: relative;
}

.typewriter__base::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.1));
  border-radius: 0 0 20px 20px;
}

.typewriter__body {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

/* Topo da máquina com rolos */
.typewriter__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  margin-bottom: 20px;
  position: relative;
}

.typewriter__roller-left,
.typewriter__roller-right {
  width: 50px;
  height: 50px;
  background: radial-gradient(circle at 30% 30%, #e8dcc8, #8b7d6b);
  border-radius: 50%;
  box-shadow: inset -3px -3px 8px rgba(0, 0, 0, 0.3), inset 3px 3px 8px rgba(255, 255, 255, 0.2);
  position: relative;
}

.typewriter__roller-left::after,
.typewriter__roller-right::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 3px,
    rgba(0, 0, 0, 0.1) 3px,
    rgba(0, 0, 0, 0.1) 6px
  );
}

/* Slot do papel */
.typewriter__paper-slot {
  flex: 1;
  background: linear-gradient(to right, #8b7d6b, #6b5d4f);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.5);
}

.typewriter__paper-slot::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), transparent);
}

/* Papel */
.paper {
  background: #f5f1e8;
  padding: 30px;
  border-radius: 4px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transform: translateY(-20px);
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  min-height: 300px;
  display: flex;
  flex-direction: column;
  position: relative;
  font-family: 'Courier New', monospace;
}

.paper.paper-enter {
  opacity: 1;
  transform: translateY(0);
}

/* Cabeçalho do papel */
.paper__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  margin-bottom: 20px;
  border-bottom: 2px solid #333;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  letter-spacing: 1px;
}

.paper__date {
  font-weight: bold;
  color: #333;
}

.paper__title {
  color: #666;
  font-size: 11px;
}

/* Conteúdo do papel */
.paper__content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.paper__form-group {
  margin-bottom: 20px;
}

.paper__label {
  display: block;
  font-size: 11px;
  font-weight: bold;
  color: #333;
  margin-bottom: 6px;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
}

.paper__input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #999;
  background: #fefdfb;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #333;
  outline: none;
  transition: all 0.3s ease;
}

.paper__input:focus {
  border-color: #666;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.paper__input::placeholder {
  color: #bbb;
}

.paper__button {
  margin-top: 15px;
  padding: 10px;
  background: #333;
  color: #f5f1e8;
  border: none;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 1px;
}

.paper__button:hover {
  background: #555;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.paper__button:active {
  transform: translateY(0);
}

.paper__guest-container {
  margin-top: 15px;
  text-align: center;
}

.paper__guest-btn {
  padding: 8px;
  background: transparent;
  color: #666;
  border: 1px dashed #999;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
}

.paper__guest-btn:hover {
  border-color: #333;
  color: #333;
  background: rgba(0, 0, 0, 0.02);
}

.paper__error-message {
  margin-top: 15px;
  padding: 10px;
  background: #ffe8e8;
  color: #c33;
  border: 1px solid #ffcccc;
  border-radius: 3px;
  text-align: center;
  font-size: 11px;
  font-family: 'Courier New', monospace;
}

/* Rodapé do papel */
.paper__footer {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px dotted #999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.paper__footer-title {
  font-size: 11px;
  color: #666;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
}

.paper__footer-line {
  width: 100%;
  height: 1px;
  background: repeating-linear-gradient(
    to right,
    #999,
    #999 4px,
    transparent 4px,
    transparent 8px
  );
}

.paper__footer-text {
  font-size: 10px;
  color: #999;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
}

/* Teclado */
.typewriter__keyboard {
  height: 80px;
  background: linear-gradient(to bottom, #3d3530, #2a2420);
  border-radius: 12px;
  padding: 12px;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.5), 0 5px 15px rgba(0, 0, 0, 0.3);
  position: relative;
}

.typewriter__keyboard::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(to bottom, #555, transparent);
  border-radius: 12px 12px 0 0;
}

.typewriter__keys {
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  gap: 8px;
  height: 100%;
}

.typewriter__key {
  background: radial-gradient(circle at 30% 30%, #c9b89a, #8b7d6b);
  border-radius: 50%;
  box-shadow: inset -2px -2px 5px rgba(0, 0, 0, 0.3), inset 2px 2px 5px rgba(255, 255, 255, 0.1),
    0 3px 8px rgba(0, 0, 0, 0.4);
  transition: all 0.1s ease;
  cursor: pointer;
}

.typewriter__key:hover {
  transform: translateY(-2px);
  box-shadow: inset -2px -2px 5px rgba(0, 0, 0, 0.3), inset 2px 2px 5px rgba(255, 255, 255, 0.1),
    0 5px 12px rgba(0, 0, 0, 0.5);
}

.typewriter__key:active {
  transform: translateY(2px);
  box-shadow: inset -2px -2px 5px rgba(0, 0, 0, 0.3), inset 2px 2px 5px rgba(255, 255, 255, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Responsividade */
@media (max-width: 768px) {
  .typewriter {
    width: 90vw;
    max-width: 500px;
    height: auto;
  }

  .typewriter__base {
    padding: 20px;
  }

  .paper {
    padding: 20px;
    font-size: 14px;
  }

  .paper__header {
    font-size: 10px;
  }

  .paper__label {
    font-size: 10px;
  }

  .paper__input {
    font-size: 11px;
  }

  .typewriter__keys {
    grid-template-columns: repeat(8, 1fr);
  }
}

@media (max-width: 480px) {
  .typewriter {
    width: 95vw;
    height: auto;
  }

  .typewriter__base {
    padding: 15px;
  }

  .paper {
    padding: 15px;
  }

  .typewriter__keys {
    grid-template-columns: repeat(6, 1fr);
    gap: 6px;
  }
}
</style>
