import { ref } from 'vue'

export function useAnimatedModal(cardEl, randomTilt) {

  // Estados
  const isModalOpen = ref(false)
  const isModalVisible = ref(false)
  const isFlipped = ref(false)
  const isAnimating = ref(false)

  // Abre modal com animação suave
  const openAnimatedModal = () => {
    if (!cardEl.value) return

    // Marca card original como "animando" (fica transparente)
    isAnimating.value = true

    // Abre modal imediatamente
    isModalOpen.value = true

    // Trigger fade-in do overlay e card após um frame
    requestAnimationFrame(() => {
      isModalVisible.value = true
    })

    // Pequeno delay antes de fazer o flip
    setTimeout(() => {
      isFlipped.value = true
    }, 200)
  }

  // Fecha modal
  const closeModal = () => {
    // Inicia fade-out
    isModalVisible.value = false
    isFlipped.value = false

    // Aguarda animação terminar antes de destruir o modal
    setTimeout(() => {
      isModalOpen.value = false
      // Remove transparência do card original
      isAnimating.value = false
    }, 300)
  }

  // Fecha modal com animação reversa
  const closeModalWithAnimation = () => {
    // Inicia fade-out
    isModalVisible.value = false
    isFlipped.value = false

    // Aguarda animação terminar antes de destruir o modal
    setTimeout(() => {
      isModalOpen.value = false
      // Remove transparência do card original
      isAnimating.value = false
    }, 300)
  }

  // Alterna flip do card
  const toggleFlip = () => {
    isFlipped.value = !isFlipped.value
  }

  return {
    isModalOpen,
    isModalVisible,
    isFlipped,
    isAnimating,
    openAnimatedModal,
    closeModal,
    closeModalWithAnimation,
    toggleFlip,
  }
}
