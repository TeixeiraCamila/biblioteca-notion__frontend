// Comunicação com backend

import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Log de requisições (opcional - pode remover)
api.interceptors.request.use((config) => {
  console.log(`📡 ${config.method?.toUpperCase()} ${config.url}`)
  return config
})

// Tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ Erro na API:', error.message)
    return Promise.reject(error)
  },
)

export { api }

// ==== Books API ==== //
export const booksAPI = {
  list(options = {}) {
    const { pageSize = 20, startCursor, search = '', status = 'all' } = options

    const params = {
      pageSize: pageSize.toString(),
      search: search,
      status: status,
    }

    if (startCursor) {
      params.startCursor = startCursor
    }

    return api.get('/books', { params })
  },

  get(id) {
    return api.get(`/books/${id}`)
  },

  create(data) {
    return api.post('/books', data)
  },

  update(id, data) {
    return api.patch(`/books/${id}`, data)
  },

  delete(id) {
    return api.delete(`/books/${id}`)
  },
}

// ==== Users API ==== //
export const userAPI = {
  list(options = {}) {
    const { startCursor, pageSize = 100 } = options

    const params = {}
    if (startCursor) {
      params.start_cursor = startCursor
    }
    params.page_size = pageSize

    return api.get('/users', { params })
  },

  listAll() {
    return api.get('/users/all')
  },

  getById(userId) {
    return api.get(`/users/${userId}`)
  },
}
