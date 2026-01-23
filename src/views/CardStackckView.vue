<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { defineAsyncComponent } from 'vue'
import CardIntro from '@/components/Stack/CardIntro.vue'
const BookList = defineAsyncComponent(() => import('@/components/BookList.vue'))
const BookForm = defineAsyncComponent(() => import('@/components/BookForm.vue'))
const TBRList = defineAsyncComponent(() => import('@/components/TBRList.vue'))

//Swiper
import { Swiper, SwiperSlide } from 'swiper/vue';
import { EffectCards } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-cards';

import gsap from 'gsap'

const router = useRouter()

const navigateToCreate = () => {
  router.push('/criar')
}

const onFormEnter = (el, done) => {
  // Animação de entrada: deslizando de cima para baixo
  gsap.fromTo(el, {
    y: '-100vh',
    opacity: 0
  }, {
    duration: 0.6,
    y: 0,
    opacity: 1,
    ease: 'power3.out',
    onComplete: done,
  })
}

const onFormLeave = (el, done) => {
  // Animação de saída: deslizando para cima
  gsap.to(el, {
    duration: 0.4,
    y: '-100vh',
    opacity: 0,
    ease: 'power2.in',
    onComplete: done,
  })
}

const modules = [EffectCards];

const currentView = ref(null)
const selectedBook = ref(null)
const isModalOpen = ref(false)
const VIEWS = {
  LIST: 'list',
  FORM: 'form',
  EDIT: 'edit'
}

// Transições entre views
const showBookForm = (book = null) => {
  selectedBook.value = book
  currentView.value = book ? VIEWS.EDIT : VIEWS.FORM
  isModalOpen.value = true
}

const showBookList = () => {
  selectedBook.value = null
  currentView.value = VIEWS.LIST
  isModalOpen.value = false
}

const handleBookSubmit = () => {
  showBookList()
}

const onSlideChange = (swiper) => {
  if (swiper.activeIndex === 1) {
    currentView.value = VIEWS.LIST;
  }
}

// Computed para facilitar template
const isFormView = computed(() => currentView.value === VIEWS.FORM)
const isEditView = computed(() => currentView.value === VIEWS.EDIT)
const isListView = computed(() => currentView.value === VIEWS.LIST);
</script>

<template>
  <Swiper :effect="'cards'" :grabCursor="true" :modules="modules" :direction="'vertical'" @slideChange="onSlideChange"
    class="stack-view__swiper">
    <SwiperSlide class="stack-view__slide">
      <CardIntro class="stack-view__card" />
    </SwiperSlide>
    <SwiperSlide class="stack-view__slide">
      <div class="stack-view__card stack-view__book-list">
        <BookList v-if="isListView" @add-book="showBookForm()" @edit-book="showBookForm($event)" />

        <Transition name="form-slide" @enter="onFormEnter" @leave="onFormLeave" :css="false">
          <BookForm v-if="isFormView || isEditView" :book="selectedBook" :is-edit="isEditView" @cancel="showBookList()"
            @submit="handleBookSubmit()" />
        </Transition>

        <!-- Floating Action Button -->
        <button v-if="isListView" @click="navigateToCreate" class="fab fab--add-book">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </SwiperSlide>
    <SwiperSlide class="stack-view__slide">
      <div class="stack-view__card stack-view__tbr" ref="tbr">
        <TBRList />
      </div>
    </SwiperSlide>

  </Swiper>
</template>

<style scoped>
.stack-view__swiper {
  width: 80vw;
  height: 80vh;
}

.stack-view__slide {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 18px;
}

.stack-view__card {
  height: inherit;
  width: 100%;
  padding: 2rem;
  height: 100%;
  width: 80vw;
  overflow-y: auto;
}

.stack-view__book-list {
  background-image: url('../assets/images/bg-default.webp');
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.stack-view__tbr {
  background-color: #8B4513;
}

/* Floating Action Button */
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
</style>
