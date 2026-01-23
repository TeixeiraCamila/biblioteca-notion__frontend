<script setup>
import { onMounted, computed } from 'vue'
import { useBookStore } from '@/stores/bookStore'

const bookStore = useBookStore()

onMounted(async () => {
  // Apenas um fetchBooks - o getter filtra automaticamente
  bookStore.filterStatus = 'all'
  bookStore.searchTerm = ''
  await bookStore.fetchBooks()
})

const tbrBooks = computed(() => bookStore.tbrBooks);
</script>

<template>
  <div class="tbr-list">
    <div class="tbr-list__header">
      <h2 class="tbr-list__title">📚 TBR - To Be Read</h2>
      <p class="tbr-list__count">{{ tbrBooks.length }} livros</p>
    </div>

    <div v-if="bookStore.loading" class="tbr-list__loading">
      Carregando...
    </div>

    <div v-else-if="tbrBooks.length === 0" class="tbr-list__empty">
      <p>Nenhum livro marcado como TBR</p>
      <p>Edite um livro para mudar seu status</p>
    </div>

    <div v-else class="tbr-list__grid">
      <div
        v-for="book in tbrBooks"
        :key="book.id"
        class="tbr-card"
      >
        <div class="tbr-card__cover">
          <img
            v-if="book.cover?.[0]"
            :src="book.cover[0]"
            :alt="book.name"
            class="tbr-card__image"
          />
          <div v-else class="tbr-card__placeholder">📖</div>
        </div>

        <div class="tbr-card__content">
          <h3 class="tbr-card__title">{{ book.name }}</h3>
          <p class="tbr-card__author">{{ book.author?.join(', ') }}</p>
          <p class="tbr-card__year" v-if="book.firstPublished">{{ book.firstPublished }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tbr-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tbr-list__header {
  text-align: center;
  margin-bottom: 2rem;
}

.tbr-list__title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--white);
  margin: 0 0 0.5rem 0;
}

.tbr-list__count {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.tbr-list__loading,
.tbr-list__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-align: center;
  color: var(--white);
}

.tbr-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  flex: 1;
  overflow-y: auto;
}

.tbr-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.tbr-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.tbr-card__cover {
  width: 100px;
  height: 140px;
  flex-shrink: 0;
  background: var(--accent3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.tbr-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tbr-card__placeholder {
  font-size: 2rem;
  color: var(--accent);
}

.tbr-card__content {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tbr-card__title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  line-height: 1.3;
}

.tbr-card__author {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
}

.tbr-card__year {
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 0;
}

@media (max-width: 768px) {
  .tbr-list__grid {
    grid-template-columns: 1fr;
  }

  .tbr-card__cover {
    width: 80px;
    height: 120px;
  }
}
</style>
