<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBookStore } from '@/stores/bookStore'
import BookCard from './BookCard.vue'
import Pagination from './Pagination.vue'
import Filters from './Filters.vue'

const bookStore = useBookStore()
const router = useRouter()

defineEmits(['add-book', 'edit-book'])

onMounted(() => {
  // Buscar todos os livros (sempre sem filtro)
  bookStore.filterStatus = 'all'
  bookStore.searchTerm = ''
  bookStore.fetchBooks()
});

const handleEditBook = (book) => {
  router.push(`/editar/${book.id}`)
}
</script>

<template>
  <div class="book-list">
    <div class="book-list__controls">
      <Filters class="book-list__filters" />
    </div>
    <div v-if="bookStore.loading" class="book-list__loading">
      <div class="book-list__spinner"></div>
      <p>Carregando livros...</p>
    </div>

    <div v-else-if="bookStore.allBooks.length === 0" class="book-list__empty-state">
      <p>📚 Nenhum livro encontrado</p>
      <button @click="$emit('add-book')" class="book-list__btn book-list__btn--primary">
        Adicionar primeiro livro
      </button>
    </div>

    <template v-else>
      <div class="book-list__books-grid">
        <BookCard v-for="book in bookStore.allBooks" :key="book.id" :book="book" @edit="handleEditBook" />
      </div>

      <Pagination :book-count="bookStore.bookCount" :page-size="bookStore.pagination.pageSize"
        :has-previous="bookStore.hasPreviousPage" :has-next="bookStore.hasNextPage" @previous="bookStore.previousPage"
        @next="bookStore.nextPage" @change-size="bookStore.changePageSize" />
    </template>
  </div>
</template>

<style scoped>
.book-list {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.book-list__controls {
  margin-bottom: 3rem;
}

.book-list__add-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, rgba(255, 228, 196, 0.8), rgba(255, 249, 238, 0.9));
  border: 2px solid rgba(139, 69, 19, 0.3);
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  color: #8b4513;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  flex-shrink: 0;
}

.book-list__add-button:hover {
  transform: translateY(-2px) rotate(1deg);
  box-shadow:
    0 6px 20px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  border-color: rgba(139, 69, 19, 0.6);
}

.book-list__add-button:active {
  transform: translateY(0) rotate(0deg);
}

.book-list__add-button-icon {
  font-size: 1.5rem;
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.2));
}

.book-list__add-button-text {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

/* Filters styling */
.book-list__filters {
  flex: 1;
}

/* Books grid */
.book-list__books-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 3rem 1.5rem;
  flex: 1;
}

/* Loading and empty states */
.book-list__loading,
.book-list__empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-align: center;
}

.book-list__empty-state .book-list__btn {
  margin-top: 1rem;
}
</style>
