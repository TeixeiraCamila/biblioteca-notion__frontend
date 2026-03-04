import { defineStore } from 'pinia'
import { booksAPI } from '../services/api'

/**
 * Pinia Store para gerenciamento de livros
 * Integrado com Notion API via backend
 */
export const useBookStore = defineStore('books', {
  state: () => ({
    // ===== DADOS PRINCIPAIS =====
    books: [],
    tbrBooksList: [],
    readingBooks: [],

    // ===== ESTADOS DE LOADING =====
    loading: false,
    loadingTbr: false,

    // ===== SISTEMA DE ERROS =====
    error: null,

    // ===== PAGINAÇÃO (CURSOR-BASED) =====
    pagination: {
      pageSize: 20,
      hasMore: false,
      nextCursor: null,
      previousCursors: [], // Stack para navegação reversa
    },

    // ===== FILTROS E BUSCA =====
    searchTerm: '',
    filterStatus: 'all',
  }),

  getters: {
    allBooks: (state) => state.books,

    bookCount: (state) => state.books.length,

    tbrCount: (state) => state.tbrBooksList.length,

    hasNextPage: (state) => state.pagination.hasMore,

    hasPreviousPage: (state) => state.pagination.previousCursors.length > 0,

    getBookById: (state) => (id) => state.books.find((book) => book.id === id),

    hasError: (state) => state.error !== null,

    readingStats: (state) => {
      const total = state.books
      const read = state.books.filter((book) => book.status === 'Read')
      const toBeRead = state.books.filter((book) => book.status === 'To be read')
      return { total, read, toBeRead }
    },
  },

  actions: {
    async fetchBookById(bookId) {
      this.loading = true
      this.error = null

      try {
        const response = await booksAPI.get(bookId)

        if (response?.data) {
          return response.data
        }

        throw new Error('Livro não encontrado')
      } catch (error) {
        this._handleError('fetchBookById', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // BUSCAR LIVROS (COM CURSOR PAGINATION)
    async fetchBooks(startCursor = undefined) {
      this.loading = true
      this.error = null

      try {
        console.log('🔄 Buscando livros do servidor...', {
          pageSize: this.pagination.pageSize,
          startCursor: startCursor,
          search: this.searchTerm,
          status: this.filterStatus,
        })

        const response = await booksAPI.list({
          pageSize: this.pagination.pageSize,
          startCursor: startCursor,
          search: this.searchTerm,
          status: this.filterStatus,
        })

        if (response?.data) {
          this.books = response.data.data || []

          // Atualiza informações de paginação
          if (response.data.pagination) {
            this.pagination.hasMore = response.data.pagination.hasMore
            this.pagination.nextCursor = response.data.pagination.nextCursor
          }
        }
      } catch (error) {
        this._handleError('fetchBooks', error)
        this.books = []
      } finally {
        this.loading = false
      }
    },

    async createBook(bookData) {
      this.loading = true
      this.error = null

      try {
        const result = await booksAPI.create(bookData)

        // Volta para primeira página após criar
        this.pagination.previousCursors = []
        await this.fetchBooks()

        // Atualiza lista TBR se necessário
        if (bookData.status === 'To be read') {
          await this.fetchTbrBooks()
        }

        return result
      } catch (error) {
        this._handleError('createBook', error)
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

        // Recarrega página atual para refletir mudanças
        const currentCursor =
          this.pagination.previousCursors[this.pagination.previousCursors.length - 1]
        await this.fetchBooks(currentCursor)

        // Atualiza lista TBR
        await this.fetchTbrBooks()

        return result
      } catch (error) {
        this._handleError('updateBook', error)
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

        // Atualiza lista TBR
        await this.fetchTbrBooks()

        return { success: true }
      } catch (error) {
        this._handleError('deleteBook', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchTbrBooks(startCursor = undefined, status = 'To be read') {
      this.loadingTbr = true
      this.error = null

      try {
        const response = await booksAPI.list({
          pageSize: this.pagination.pageSize,
          startCursor: startCursor,
          search: this.searchTerm,
          status: status,
        })

        switch (status) {
          case 'To be read':
            this.tbrBooksList = response.data.data || []
            break
          case 'Reading':
            this.readingBooks = response.data.data || []
            break
          default:
            break
        }
      } catch (error) {
        this._handleError('fetchTbrBooks', error)
        // Limpa apenas a lista correspondente ao status que estava sendo buscado
        if (status === 'To be read') {
          this.tbrBooksList = []
        } else if (status === 'Reading') {
          this.readingBooks = []
        }
      } finally {
        this.loadingTbr = false
      }
    },

    async nextPage() {
      if (!this.pagination.hasMore || !this.pagination.nextCursor) {
        console.warn('⚠️ Não há próxima página')
        return
      }

      // Salva cursor atual no stack antes de avançar
      this.pagination.previousCursors.push(this.pagination.nextCursor)

      await this.fetchBooks(this.pagination.nextCursor)
    },

    async previousPage() {
      if (this.pagination.previousCursors.length === 0) {
        console.warn('⚠️ Não há página anterior')
        return
      }

      console.log('⬅️ Página anterior')

      // Remove último cursor do stack
      this.pagination.previousCursors.pop()

      // Usa o cursor anterior (ou undefined se for a primeira página)
      const previousCursor =
        this.pagination.previousCursors[this.pagination.previousCursors.length - 1]

      await this.fetchBooks(previousCursor)
    },

    async changePageSize(size) {
      this.pagination.pageSize = size
      this.pagination.previousCursors = []

      await this.fetchBooks()
    },

    async search(term) {
      this.searchTerm = term
      this.pagination.previousCursors = []

      await this.fetchBooks()
    },

    async clearSearch() {
      this.searchTerm = ''
      this.pagination.previousCursors = []

      await this.fetchBooks()
    },

    async filterByStatus(status) {
      this.filterStatus = status
      this.pagination.previousCursors = []

      await this.fetchBooks()
    },

    $reset() {
      console.log('🔄 Resetando store')

      this.books = []
      this.tbrBooksList = []
      this.loading = false
      this.loadingTbr = false
      this.error = null
      this.pagination = {
        pageSize: 18,
        hasMore: false,
        nextCursor: null,
        previousCursors: [],
      }
      this.searchTerm = ''
      this.filterStatus = 'all'
    },

    clearError() {
      this.error = null
    },

    // ========================================
    // TRATAMENTO DE ERROS (PRIVADO)
    // ========================================
    _handleError(action, error) {
      console.error(`❌ Erro em ${action}:`, error)

      // Extrai mensagem de erro apropriada
      if (error.response) {
        // Erro da API
        const status = error.response.status
        const message = error.response.data?.message || error.message

        switch (status) {
          case 400:
            this.error = 'Dados inválidos. Verifique as informações enviadas.'
            break
          case 401:
            this.error = 'Não autorizado. Verifique suas credenciais.'
            break
          case 404:
            this.error = 'Recurso não encontrado.'
            break
          case 500:
            this.error = 'Erro no servidor. Tente novamente mais tarde.'
            break
          default:
            this.error = message || 'Erro ao processar requisição'
        }
      } else if (error.request) {
        // Erro de rede
        this.error = 'Erro de conexão. Verifique sua internet.'
      } else {
        // Outro erro
        this.error = error.message || 'Erro desconhecido'
      }
    },
  },
})
