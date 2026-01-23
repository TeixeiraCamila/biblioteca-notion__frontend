<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="confirm-dialog__overlay" @click="handleCancel">
        <div class="confirm-dialog__content" @click.stop>
          <div class="confirm-dialog__header">
            <h3 class="confirm-dialog__title">{{ title }}</h3>
          </div>

          <div class="confirm-dialog__body">
            <p>{{ message }}</p>
          </div>

          <div class="confirm-dialog__footer">
            <button @click="handleCancel" class="confirm-dialog__btn confirm-dialog__btn--secondary">Cancelar</button>
            <button @click="handleConfirm" class="confirm-dialog__btn confirm-dialog__btn--danger">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: { type: String, default: 'Confirmar ação' },
  message: { type: String, required: true },
  confirmText: { type: String, default: 'Confirmar' },
})

const emit = defineEmits(['confirm', 'cancel'])

const isOpen = ref(false)

const open = () => {
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

const handleConfirm = () => {
  emit('confirm')
  close()
}

const handleCancel = () => {
  emit('cancel')
  close()
}

// Expõe métodos para componente pai
defineExpose({
  open,
  close,
})
</script>

<style scoped>
.confirm-dialog__overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.confirm-dialog__content {
  background: var(--color-book-card__face--background);
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 28rem;
  width: 90%;
  box-shadow: var(--shadow-lg);
}

.confirm-dialog__header {
  margin-bottom: 1rem;
}

.confirm-dialog__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.confirm-dialog__body {
  margin-bottom: 1.5rem;
  color: var(--color-text-soft);
  line-height: 1.6;
}

.confirm-dialog__footer {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.confirm-dialog__btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.confirm-dialog__btn--secondary {
  background: var(--color-book-card__face--background-mute);
  color: var(--color-text);
}

.confirm-dialog__btn--secondary:hover {
  background: var(--color-border-hover);
}

.confirm-dialog__btn--danger {
  background: var(--color-error);
  color: var(--white);
}

.confirm-dialog__btn--danger:hover {
  background: #dc2626;
}

/* Animação de entrada */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
