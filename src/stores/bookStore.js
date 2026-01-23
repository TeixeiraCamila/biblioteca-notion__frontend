// stores/bookStore.js

/*03
  O que faz: Gerenciamento de estado global com cursor pagination
*/
import { defineStore } from 'pinia'
import { booksAPI } from '../services/api'

export const useBookStore = defineStore('books', {
  state: () => ({
    books: [],
    loading: false,
    error: null,

    // Cursor pagination
    pagination: {
      pageSize: 20,
      hasMore: false,
      nextCursor: null,
      previousCursors: [], // Guarda cursors anteriores para voltar
    },

    searchTerm: '',
    filterStatus: 'all',
  }),

  getters: {
    // Livros filtrados por status TBR
    tbrBooks: (state) => state.books.filter(book => book.status === 'To be read'),

    // Todos os livros (para BookList)
    allBooks: (state) => state.books,

    bookCount: (state) => state.books.length,
    hasNextPage: (state) => state.pagination.hasMore,
    hasPreviousPage: (state) => state.pagination.previousCursors.length > 0,

    getBookById: (state) => (id) => {
      return state.books.find((book) => book.id === id)
    },
  },

  actions: {
    async fetchBooks(startCursor = undefined) {
      this.loading = true
      this.error = null

      try {
        const response = await booksAPI.list({
          pageSize: this.pagination.pageSize,
          startCursor: startCursor,
          search: this.searchTerm,
          status: this.filterStatus,
        })

        if (response && response.data) {
          this.books = response.data.data || []

          if (response.data.pagination) {
            this.pagination.hasMore = response.data.pagination.hasMore
            this.pagination.nextCursor = response.data.pagination.nextCursor
          }
        }
      } catch (error) {
        this.error = 'Erro ao carregar livros'
        this.books = []
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async createBook(bookData) {
      this.loading = true
      this.error = null

      try {
        const result = await booksAPI.create(bookData)
        // Volta para primeira página
        this.pagination.previousCursors = []
        await this.fetchBooks()
        return result
      } catch (error) {
        this.error = 'Erro ao criar livro'
        console.error(error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateBook(bookId, bookData) {
      this.loading = true
      this.error = null

      try {
        const result = await booksAPI.update(bookId, bookData)
        // Recarrega página atual
        const currentCursor =
          this.pagination.previousCursors[this.pagination.previousCursors.length - 1]
        await this.fetchBooks(currentCursor)
        return result
      } catch (error) {
        this.error = 'Erro ao atualizar livro'
        console.error(error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteBook(bookId) {
      this.loading = true
      this.error = null

      try {
        await booksAPI.delete(bookId)
        // Recarrega página atual
        const currentCursor =
          this.pagination.previousCursors[this.pagination.previousCursors.length - 1]
        await this.fetchBooks(currentCursor)
        return { success: true }
      } catch (error) {
        this.error = 'Erro ao deletar livro'
        console.error(error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Próxima página (usa nextCursor do Notion)
    async nextPage() {
      if (this.pagination.hasMore && this.pagination.nextCursor) {
        // Guarda cursor atual antes de avançar
        const currentCursor =
          this.pagination.previousCursors[this.pagination.previousCursors.length - 1] || undefined
        this.pagination.previousCursors.push(this.pagination.nextCursor)

        await this.fetchBooks(this.pagination.nextCursor)
      }
    },

    // Página anterior (volta para cursor anterior)
    async previousPage() {
      if (this.pagination.previousCursors.length > 0) {
        // Remove último cursor
        this.pagination.previousCursors.pop()

        // Usa o cursor anterior (ou undefined se for a primeira página)
        const previousCursor =
          this.pagination.previousCursors[this.pagination.previousCursors.length - 1]

        await this.fetchBooks(previousCursor)
      }
    },

    // Mudar tamanho da página
    async changePageSize(size) {
      this.pagination.pageSize = size
      this.pagination.previousCursors = []
      await this.fetchBooks()
    },

    // Buscar (volta pra primeira página)
    async search(term) {
      this.searchTerm = term
      this.pagination.previousCursors = []
      await this.fetchBooks()
    },

    // Filtrar por status (volta pra primeira página)
    async filterByStatus(status) {
      this.filterStatus = status
      this.pagination.previousCursors = []
      await this.fetchBooks()
    },

    setSearchTerm(term) {
      this.searchTerm = term
    },

    setFilterStatus(status) {
      this.filterStatus = status
    },
  },
})
/*
Componente chama action
    ↓
bookStore.fetchBooks()
    ↓
api.list() faz fetch
    ↓
Backend responde
    ↓
Action atualiza state
    ↓
Getters recalculam
    ↓
Componentes re-renderizam automaticamente
*/
