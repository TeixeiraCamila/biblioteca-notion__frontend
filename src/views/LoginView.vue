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
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fff8f0 0%, #ffe8d6 100%);
  overflow: hidden;
  perspective: 1200px;
}

/* Container da câmera */
.polaroid-container {
  opacity: 0;
  transform: translateY(50px) scale(0.9) rotateX(15deg);
  transition: all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.polaroid-container.camera-enter {
  opacity: 1;
  transform: translateY(0) scale(1) rotateX(0);
}

/* Câmera Polaroid */
.camera {
  position: relative;
  width: 420px;
  height: 520px;
  filter: drop-shadow(0 30px 80px rgba(0, 0, 0, 0.25));
}

.camera__body {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 
    inset -8px -8px 20px rgba(0, 0, 0, 0.1),
    inset 8px 8px 20px rgba(255, 255, 255, 0.8),
    0 30px 80px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.camera__body::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.8), transparent);
  z-index: 10;
}

/* Topo da câmera */
.camera__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 0 15px;
}

.camera__flash {
  width: 45px;
  height: 45px;
  background: radial-gradient(circle at 35% 35%, #ffeb99, #ffd700);
  border-radius: 50%;
  box-shadow: 
    inset -2px -2px 8px rgba(0, 0, 0, 0.2),
    inset 2px 2px 8px rgba(255, 255, 255, 0.5),
    0 4px 12px rgba(255, 215, 0, 0.4);
}

.camera__lens {
  width: 55px;
  height: 55px;
  background: radial-gradient(circle at 30% 30%, #333, #1a1a1a);
  border-radius: 50%;
  box-shadow: 
    inset -3px -3px 10px rgba(0, 0, 0, 0.8),
    inset 3px 3px 10px rgba(255, 255, 255, 0.1),
    0 5px 15px rgba(0, 0, 0, 0.4);
  position: relative;
}

.camera__lens::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.1), transparent);
  top: 0;
  left: 0;
}

/* Visor */
.camera__viewfinder {
  width: 100%;
  height: 120px;
  background: linear-gradient(135deg, #e0e0e0, #d0d0d0);
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 8px;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.1);
}

.camera__viewfinder-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a1a, #0d0d0d);
  border-radius: 4px;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.8);
}

/* Slot de saída da foto */
.camera__photo-slot {
  flex: 1;
  position: relative;
  overflow: visible;
  display: flex;
  justify-content: center;
  padding-bottom: 30px;
}

/* Foto */
.photo {
  width: 280px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transform: translateY(-40px);
  transition: all 1.8s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: absolute;
  top: -20px;
  z-index: 5;
}

.photo.photo-exit {
  opacity: 1;
  transform: translateY(200px);
}

.photo__front {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 4px;
  overflow: hidden;
}

.photo__content {
  padding: 25px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.photo__title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
  letter-spacing: 1px;
}

.photo__form-group {
  margin-bottom: 18px;
}

.photo__label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #555;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.photo__input {
  width: 100%;
  padding: 10px;
  border: none;
  border-bottom: 2px solid #ddd;
  background: transparent;
  font-size: 13px;
  color: #333;
  outline: none;
  transition: all 0.3s ease;
  font-family: inherit;
}

.photo__input:focus {
  border-bottom-color: #333;
  background: rgba(0, 0, 0, 0.02);
}

.photo__input::placeholder {
  color: #bbb;
}

.photo__button {
  margin-top: 20px;
  padding: 12px;
  background: #333;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
}

.photo__button:hover {
  background: #555;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.photo__guest-container {
  margin-top: 15px;
  text-align: center;
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
