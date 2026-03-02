<script setup>
import { defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import CardIntro from '@/components/Stack/CardIntro.vue'
import { useBookStore } from '@/stores/bookStore'

const bookStore = useBookStore()
const userStore = useUserStore()

// Lazy load dos componentes pesados para melhor performance
const BookList = defineAsyncComponent(() => import('@/components/BookList.vue'))
const TBRList = defineAsyncComponent(() => import('@/components/TBRList.vue'))

// Swiper para navegação entre cards
import { Swiper, SwiperSlide } from 'swiper/vue'
import { EffectCards } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-cards'

const router = useRouter()
const modules = [EffectCards]

/**
 * Navega para página de criação de livro
 */
const navigateToCreate = () => {
  router.push('/criar')
}

/**
 * Handler para mudança de slide (apenas para debug em DEV)
 */
const onSlideChange = (swiper) => {

  if (swiper.activeIndex === 1) {
    console.log('TBR next');
    bookStore.fetchTbrBooks()
  }
};
</script>

<template>
  <Swiper :effect="'cards'" :grab-cursor="true" :modules="modules" :direction="'vertical'" class="stack-view__swiper"
    @slideChange="onSlideChange">
    <!-- Slide 1: Introdução -->
    <SwiperSlide class="stack-view__slide">
      <CardIntro class="stack-view__card" />
    </SwiperSlide>

    <!-- Slide 2: Lista de Livros -->
    <SwiperSlide class="stack-view__slide">
      <div class="stack-view__card stack-view__book-list">
        <BookList />

        <!-- Botão flutuante para adicionar livro -->
        <button v-if="!userStore.isGuest" class="fab" aria-label="Adicionar novo livro" @click="navigateToCreate">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true">
            <path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </SwiperSlide>

    <!-- Slide 3: Lista TBR (To Be Read) -->
    <SwiperSlide class="stack-view__slide">
      <div class="stack-view__card stack-view__tbr">
        <TBRList />
      </div>
    </SwiperSlide>
  </Swiper>
</template>

<style scoped>
/* Container principal do Swiper */
.stack-view__swiper {
  width: 80vw;
  height: 80vh;
}

/* Slide individual */
.stack-view__slide {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 18px;
}

/* Card base dentro do slide */
.stack-view__card {
  width: 100%;
  height: 100%;
  padding: 2rem;
  overflow-y: auto;
}

/* Card da lista de livros com background */
.stack-view__book-list {
  background-image: url('../assets/images/bg-default.webp');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Card TBR com cor sólida */
.stack-view__tbr {
  background-color: #8b4513;
}

/* ===== FLOATING ACTION BUTTON ===== */
.fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: var(--accent3);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
}

.fab:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.fab:active {
  transform: scale(0.95);
}

.fab svg {
  transition: transform 0.2s ease;
}

.fab:hover svg {
  transform: rotate(90deg);
}

/* ===== RESPONSIVIDADE ===== */
@media (max-width: 768px) {
  .stack-view__swiper {
    width: 95vw;
    height: 90vh;
  }

  .stack-view__card {
    padding: 1rem;
  }

  .fab {
    bottom: 1rem;
    right: 1rem;
    width: 48px;
    height: 48px;
  }
}
</style>
