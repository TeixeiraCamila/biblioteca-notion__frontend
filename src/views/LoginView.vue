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
const showCamera = ref(false)
const showPhoto = ref(false)

// Carrega usuários ao montar
onMounted(async () => {
  try {
    // Inicia animações de entrada
    setTimeout(() => {
      showCamera.value = true
    }, 100)

    setTimeout(() => {
      showPhoto.value = true
    }, 1000)

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
    <!-- Câmera Polaroid -->
    <div class="polaroid-container" :class="{ 'camera-enter': showCamera }">
      <!-- Câmera -->
      <div class="camera">
        <!-- Corpo da câmera -->
        <div class="camera__body">
          <!-- Topo da câmera -->
          <div class="camera__top">
            <div class="camera__flash"></div>
            <div class="camera__lens"></div>
          </div>

          <!-- Visor -->
          <div class="camera__viewfinder">
            <div class="camera__viewfinder-inner"></div>
          </div>

          <!-- Slot de saída da foto -->
          <div class="camera__photo-slot">
            <!-- Foto/Formulário descendo -->
            <div class="photo" :class="{ 'photo-exit': showPhoto }">
              <!-- Frente da foto (branca) -->
              <div class="photo__front">
                <!-- Conteúdo do formulário -->
                <div class="photo__content">
                  <h2 class="photo__title">Login</h2>

                  <form @submit.prevent="handleLogin">
                    <div class="photo__form-group">
                      <label for="name" class="photo__label">Nome</label>
                      <input
                        id="name"
                        v-model="name"
                        type="text"
                        class="photo__input"
                        placeholder="seu nome"
                        required
                      />
                    </div>

                    <div class="photo__form-group">
                      <label for="email" class="photo__label">Email</label>
                      <input
                        id="email"
                        v-model="email"
                        type="email"
                        class="photo__input"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>

                    <Button type="submit" class="photo__button">
                      <span>Entrar</span>
                    </Button>
                  </form>

                  <div class="photo__guest-container">
                    <Button type="button" class="photo__guest-btn" @click="handleGuestLogin">
                      <span>Entrar como Visitante</span>
                    </Button>
                  </div>

                  <div v-if="error" class="photo__error-message">
                    {{ error }}
                  </div>
                </div>

                <!-- Rodapé da foto (área branca típica de Polaroid) -->
                <div class="photo__footer">
                  <span class="photo__date">2024</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Controles da câmera -->
          <div class="camera__controls">
            <div class="camera__button"></div>
            <div class="camera__brand">POLAROID</div>
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
  max-width: 400px;
  background-image: url('../assets/images/bg-login.webp');
  background-repeat: no-repeat;
  background-size: contain;
  height: 100vh;
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

.photo__guest-btn {
  padding: 8px 12px;
  background: transparent;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.photo__guest-btn:hover {
  border-color: #333;
  color: #333;
  background: rgba(0, 0, 0, 0.02);
}

.photo__error-message {
  margin-top: 15px;
  padding: 10px;
  background: #fee;
  color: #c33;
  border: 1px solid #fcc;
  border-radius: 4px;
  text-align: center;
  font-size: 12px;
}

/* Rodapé da foto (área branca típica) */
.photo__footer {
  height: 50px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #eee;
}

.photo__date {
  font-size: 11px;
  color: #999;
  letter-spacing: 1px;
}

/* Controles da câmera */
.camera__controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  margin-top: 10px;
}

.camera__button {
  width: 50px;
  height: 50px;
  background: radial-gradient(circle at 35% 35%, #e8e8e8, #c0c0c0);
  border-radius: 50%;
  box-shadow:
    inset -3px -3px 10px rgba(0, 0, 0, 0.2),
    inset 3px 3px 10px rgba(255, 255, 255, 0.8),
    0 5px 15px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.camera__button:hover {
  transform: scale(1.05);
}

.camera__button:active {
  transform: scale(0.95);
  box-shadow:
    inset -3px -3px 10px rgba(0, 0, 0, 0.3),
    inset 3px 3px 10px rgba(255, 255, 255, 0.6),
    0 2px 5px rgba(0, 0, 0, 0.2);
}

.camera__brand {
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 2px;
  color: #333;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
}

/* Responsividade */
@media (max-width: 768px) {
  .camera {
    width: 360px;
    height: 450px;
  }

  .camera__body {
    padding: 15px;
  }

  .photo {
    width: 240px;
  }

  .photo__content {
    padding: 20px;
  }

  .photo.photo-exit {
    transform: translateY(150px);
  }
}

@media (max-width: 480px) {
  .camera {
    width: 95vw;
    max-width: 340px;
    height: auto;
  }

  .camera__body {
    padding: 12px;
  }

  .camera__viewfinder {
    height: 100px;
  }

  .photo {
    width: 85vw;
    max-width: 220px;
  }

  .photo__content {
    padding: 15px;
  }

  .photo__title {
    font-size: 18px;
  }

  .photo.photo-exit {
    transform: translateY(120px);
  }
}
</style>
