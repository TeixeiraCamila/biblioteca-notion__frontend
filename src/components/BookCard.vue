<script setup>
import { ref, onMounted } from 'vue'
import { useBookStore } from '@/stores/bookStore'
import { useNotifications } from '@/composables/useNotifications'
import ConfirmDialog from './ConfirmDialog.vue'
import CardFront from './BookCard/CardFront.vue'
import CardBack from './BookCard/CardBack.vue'

import { useAnimatedModal } from '@/composables/useAnimatedModal.js'

const { addNotification } = useNotifications()

const props = defineProps({
  book: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['edit'])

const bookStore = useBookStore()
const deleteDialog = ref(null)
const cardEl = ref(null)
const randomTilt = ref(0)
const isEditing = ref(false)

const {
  isModalOpen,
  isModalVisible,
  isFlipped,
  isAnimating,
  openAnimatedModal,
  closeModal,
  toggleFlip
} = useAnimatedModal(cardEl, randomTilt)

onMounted(() => {
  randomTilt.value = Math.random() * 6 - 3 // -3deg a +3deg
})

// Lógica de delete
const openDeleteDialog = () => {
  deleteDialog.value?.open()
}

// Deleta livro através do store
const handleDelete = async () => {
  try {
    await bookStore.deleteBook(props.book.id)
    closeModal() // Fecha o modal após deletar
    // Notificação já é exibida no ConfirmDialog após sucesso da operação
    // Não é necessário duplicar aqui
  } catch (error) {
    console.error('Erro ao deletar livro:', error)
    addNotification('Erro ao deletar livro. Tente novamente.', 'error')
  }
}

//  Propaga evento de edição para o componente pai
const handleEdit = (book) => {
  isEditing.value = true
  closeModal() // Fecha o modal antes de editar

  // Pequeno delay para garantir o fechamento do modal antes de emitir o evento
  setTimeout(() => {
    emit('edit', book)
    isEditing.value = false
  }, 200)
};
</script>

<template>
  <div>
    <!-- Card na lista -->
    <div ref="cardEl" class="book-card book-card--list" :class="{
      'book-card--animating': isAnimating,
      'book-card--editing': isEditing
    }"
      :style="{ transform: `rotate(${randomTilt}deg)` }" @click="openAnimatedModal">
      <CardFront :book="book" :rotate="`rotate(${randomTilt}deg)`" />
    </div>

    <!-- Modal com flip card -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="book-modal__overlay" :class="{ visible: isModalVisible }" @click.self="closeModal">
        <div class="book-modal__container" :class="{ visible: isModalVisible }" @click="toggleFlip">
          <div class="book-card__flip" :class="{ 'book-card__flip--flipped': isFlipped }">
            <!-- Frente do card -->
            <div class="book-card__face book-card__face--front">
              <CardFront :book="book" :is-modal="true" :key="book.id" :rotate="`rotate(${randomTilt}deg)`" />
            </div>

            <!-- Verso do card -->
            <div class="book-card__face book-card__face--back">
              <!-- ✅ CORRIGIDO: Escuta eventos do CardBack -->
              <CardBack :book="book" :key="book.id" :rotate="`rotate(${randomTilt}deg)`" @edit="handleEdit"
                @delete="openDeleteDialog" />
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Dialog de confirmação de delete -->
    <ConfirmDialog ref="deleteDialog" title="Deletar Livro"
      :message="`Tem certeza que deseja deletar '${book.name}'? Esta ação não pode ser desfeita.`"
      confirm-text="Deletar" @confirm="handleDelete" />
  </div>
</template>

<style>
:root {
  --card-w: 200px;
  --card-h: 200px;
}

.card-front__image {
  width: 100%;
  height: 100%;
}
</style>

<style scoped>
.book-card {
  padding: 1rem;
  background: var(--white);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: var(--card-w);
  margin: 0 auto;
  transform-origin: center center;
  opacity: 1;
}

/* Card fica transparente durante animação */
.book-card.book-card--animating {
  opacity: 0;
  pointer-events: none;
}

/* Efeito de edição */
.book-card--editing {
  animation: editing-pulse 0.6s ease-in-out;
}

@keyframes editing-pulse {
  0% { transform: rotate(var(--random-tilt, 0deg)) scale(1); }
  50% { transform: rotate(var(--random-tilt, 0deg)) scale(1.05); }
  100% { transform: rotate(var(--random-tilt, 0deg)) scale(1); }
}

/* MODAL OVERLAY (FUNDO ESCURECIDO) */
.book-modal__overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  backdrop-filter: blur(0px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  transition: all 0.3s ease;
}

.book-modal__overlay.visible {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

/* CONTAINER DO CARD NO MODAL */
.book-modal__container {
  cursor: pointer;
  perspective: 2000px;
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.book-modal__container.visible {
  opacity: 1;
  transform: scale(1);
}

/* FLIP WRAPPER (3D FLIP) */
.book-card__flip {
  width: calc(var(--card-w) * 1.1);
  height: calc(var(--card-h) * 1.1);
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.book-card__flip.book-card__flip--flipped {
  transform: rotateY(180deg);
}

/* FACES DO CARD (FRENTE E VERSO) */
.book-card__face {
  position: absolute;
  inset: 0;
  padding: 1rem;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  background: var(--white);
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  min-height: 300px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.book-card__face.book-card__face--front {
  transform: rotateY(0deg);
}

.book-card__face.book-card__face--back {
  transform: rotateY(180deg);
  padding: 0;
}

/* SCROLL CUSTOMIZADO */
.book-card__face::-webkit-scrollbar {
  width: 8px;
}

.book-card__face::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.book-card__face::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.book-card__face::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* RESPONSIVO */
@media (max-width: 768px) {
  .book-card__flip {
    width: 90vw;
    max-width: 320px;
    height: 480px;
  }

  .book-card {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .book-card__flip {
    width: 95vw;
    max-width: 280px;
    height: 420px;
  }
}
</style>
