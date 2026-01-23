import { ref } from 'vue'

export function useAnimatedModal(cardEl, randomTilt) {

  // Estados
  const isModalOpen = ref(false)
  const isModalVisible = ref(false)
  const isFlipped = ref(false)
  const isAnimating = ref(false)

  // Abre modal com animação do card indo até o centro
  const openAnimatedModal = () => {
    if (!cardEl.value) return

    const rect = cardEl.value.getBoundingClientRect()

    // 🆕 Marca card original como "animando" (fica transparente)
    isAnimating.value = true

    // Cria clone visual do card
    const clone = cardEl.value.cloneNode(true)

    // Remove classe de animação do clone
    clone.classList.remove('book-card--animating')

    // Remove interatividade do clone
    clone.style.pointerEvents = 'none'

    // Posiciona clone exatamente onde está o card original
    Object.assign(clone.style, {
      position: 'fixed',
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      margin: '0',
      zIndex: '9998',
      transform: `rotate(${randomTilt.value}deg)`,
      transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    })

    document.body.appendChild(clone)

    // Força reflow para garantir que a transição aconteça
    clone.offsetHeight

    // Inicia animação do clone para o centro
    // 🆕 MANTÉM O MESMO TAMANHO
    requestAnimationFrame(() => {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      // Calcula posição central
      const centerX = viewportWidth / 2
      const centerY = viewportHeight / 2

      Object.assign(clone.style, {
        top: `${centerY}px`,
        left: `${centerX}px`,
        // 🆕 MANTÉM tamanho original (não aumenta)
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        transform: 'translate(-50%, -50%) rotate(0deg)',
      })
    })

    // Aguarda fim da animação (500ms)
    setTimeout(() => {
      // Remove clone
      if (document.body.contains(clone)) {
        document.body.removeChild(clone)
      }

      // Abre modal real
      isModalOpen.value = true

      // Trigger fade-in do overlay e card após um frame
      requestAnimationFrame(() => {
        isModalVisible.value = true
      })

      // Pequeno delay antes de fazer o flip
      setTimeout(() => {
        isFlipped.value = true
      }, 150)
    }, 500)
  }

  // Fecha modal
  const closeModal = () => {
    // Inicia fade-out
    isModalVisible.value = false
    isFlipped.value = false

    // Aguarda animação terminar antes de destruir o modal
    setTimeout(() => {
      isModalOpen.value = false
      // 🆕 Remove transparência do card original
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
    toggleFlip,
  }
}
