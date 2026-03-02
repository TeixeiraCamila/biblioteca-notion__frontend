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
    /**
     * Retorna todos os livros da página atual
     */
    allBooks: (state) => state.books,

    /**
     * Conta total de livros na página atual
     */
    bookCount: (state) => state.books.length,

    /**
     * Conta total de livros TBR
     */
    tbrCount: (state) => state.tbrBooksList.length,

    /**
     * Verifica se existe próxima página
     */
    hasNextPage: (state) => state.pagination.hasMore,

    /**
     * Verifica se pode voltar para página anterior
     */
    hasPreviousPage: (state) => state.pagination.previousCursors.length > 0,

    /**
     * Busca livro por ID
     */
    getBookById: (state) => (id) => state.books.find((book) => book.id === id),

    /**
     * Verifica se há erro ativo
     */
    hasError: (state) => state.error !== null,
  },

  actions: {
    // ========================================
    // BUSCAR LIVRO POR ID
    // ========================================
    async fetchBookById(bookId) {
      this.loading = true
      this.error = null

      try {
        console.log('🔍 Buscando livro por ID...', bookId)

        const response = await booksAPI.get(bookId)

        if (response?.data) {
          console.log('✅ Livro encontrado')
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

    // ========================================
    // BUSCAR LIVROS (COM CURSOR PAGINATION)
    // ========================================
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

          console.log(`✅ ${this.books.length} livros carregados`)
        }
      } catch (error) {
        this._handleError('fetchBooks', error)
        this.books = []
      } finally {
        this.loading = false
      }
    },

    // ========================================
    // CRIAR NOVO LIVRO
    // ========================================
    async createBook(bookData) {
      this.loading = true
      this.error = null

      try {
        console.log('➕ Criando novo livro...', bookData)

        const result = await booksAPI.create(bookData)

        console.log('✅ Livro criado com sucesso')

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

    // ========================================
    // ATUALIZAR LIVRO EXISTENTE
    // ========================================
    async updateBook(bookId, bookData) {
      this.loading = true
      this.error = null

      try {
        console.log('✏️ Atualizando livro...', { bookId, bookData })

        const result = await booksAPI.update(bookId, bookData)

        console.log('✅ Livro atualizado com sucesso')

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

    // ========================================
    // DELETAR LIVRO
    // ========================================
    async deleteBook(bookId) {
      this.loading = true
      this.error = null

      try {
        console.log('🗑️ Deletando livro...', bookId)

        await booksAPI.delete(bookId)

        console.log('✅ Livro deletado com sucesso')

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

    // ========================================
    // BUSCAR LIVROS TBR (TO BE READ)
    // ========================================
    async fetchTbrBooks(startCursor = undefined) {
      this.loadingTbr = true
      this.error = null

      try {
        console.log('🔄 Buscando lista TBR...')

        const response = await booksAPI.list({
          pageSize: this.pagination.pageSize,
          startCursor: startCursor,
          search: this.searchTerm,
          status: 'To be read',
        })

        this.tbrBooksList = response.data.data || []

        console.log(`✅ ${this.tbrBooksList.length} livros TBR carregados`)
      } catch (error) {
        this._handleError('fetchTbrBooks', error)
        this.tbrBooksList = []
      } finally {
        this.loadingTbr = false
      }
    },

    // ========================================
    // NAVEGAÇÃO - PRÓXIMA PÁGINA
    // ========================================
    async nextPage() {
      if (!this.pagination.hasMore || !this.pagination.nextCursor) {
        console.warn('⚠️ Não há próxima página')
        return
      }

      console.log('➡️ Próxima página')

      // Salva cursor atual no stack antes de avançar
      this.pagination.previousCursors.push(this.pagination.nextCursor)

      await this.fetchBooks(this.pagination.nextCursor)
    },

    // ========================================
    // NAVEGAÇÃO - PÁGINA ANTERIOR
    // ========================================
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

    // ========================================
    // ALTERAR TAMANHO DA PÁGINA
    // ========================================
    async changePageSize(size) {
      console.log(`📄 Alterando tamanho da página para ${size}`)

      this.pagination.pageSize = size
      this.pagination.previousCursors = []

      await this.fetchBooks()
    },

    // ========================================
    // BUSCAR (SEARCH)
    // ========================================
    async search(term) {
      console.log(`🔍 Buscando: "${term}"`)

      this.searchTerm = term
      this.pagination.previousCursors = []

      await this.fetchBooks()
    },

    // ========================================
    // LIMPAR BUSCA
    // ========================================
    async clearSearch() {
      console.log('🧹 Limpando busca')

      this.searchTerm = ''
      this.pagination.previousCursors = []

      await this.fetchBooks()
    },

    // ========================================
    // FILTRAR POR STATUS
    // ========================================
    async filterByStatus(status) {
      console.log(`🔎 Filtrando por status: ${status}`)

      this.filterStatus = status
      this.pagination.previousCursors = []

      await this.fetchBooks()
    },

    // ========================================
    // RESETAR STORE
    // ========================================
    $reset() {
      console.log('🔄 Resetando store')

      this.books = []
      this.tbrBooksList = []
      this.loading = false
      this.loadingTbr = false
      this.error = null
      this.pagination = {
        pageSize: 20,
        hasMore: false,
        nextCursor: null,
        previousCursors: [],
      }
      this.searchTerm = ''
      this.filterStatus = 'all'
    },

    // ========================================
    // LIMPAR ERRO
    // ========================================
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
