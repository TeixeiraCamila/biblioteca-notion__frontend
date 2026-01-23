<template>
  <div class="create-book-view">
    <header class="create-book-view__header">
      <router-link to="/" class="create-book-view__link"> ← Voltar </router-link>
    </header>

    <main class="create-book-view__content">
      <BookForm :book="book" :is-edit="isEdit" @submit="handleSubmit" @cancel="handleCancel" />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookStore } from '@/stores/bookStore'
import BookForm from '@/components/BookForm.vue'

const route = useRoute()
const router = useRouter()
const bookStore = useBookStore()

const book = ref(null)
const isEdit = computed(() => !!route.params.id)

onMounted(async () => {
  if (isEdit.value) {
    const bookId = route.params.id

    // Se não há livros carregados, buscar todos
    if (bookStore.allBooks.length === 0) {
      await bookStore.fetchBooks()
    }

    // Buscar livro pelo ID
    book.value = bookStore.getBookById(bookId)

    if (!book.value) {
      // Livro não encontrado
      alert('Livro não encontrado')
      router.push('/')
    }
  }
})

const handleSubmit = () => {
  router.push('/')
}

const handleCancel = () => {
  router.push('/')
};
</script>

<style scoped>
.create-book-view {
  width: 80vw;
  height: 80vh;
  background: linear-gradient(to bottom right, #eef2ff, white, #faf5ff);
  overflow: scroll;
  border-radius: 12px;
}

.create-book-view__header {
  padding: 1rem 1.5rem;
  box-shadow: var(--box-shadow);
  border-radius: 12px;
}

.create-book-view__link {
  color: #111827;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.create-book-view__link:hover {
  color: var(--accent3_muted);
}

.create-book-view__content {
  /* Add styles if needed */
}
</style>
