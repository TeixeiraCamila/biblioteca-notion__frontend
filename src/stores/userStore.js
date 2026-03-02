import { defineStore } from 'pinia'
import { userAPI } from '@/services/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    userActive: null,
    loading: false,
    error: null,
    isGuest: false,
  }),

  getters: {
    // Get all users as array
    allUsers: (state) => state.users,

    // Find user by ID
    getUserById: (state) => (userId) => {
      return state.users.find((user) => user.id === userId)
    },

    // Filter by type (person or bot)
    getUsersByType: (state) => (type) => {
      return state.users.filter((user) => user.type === type)
    },
  },

  actions: {
    // fetch single page of users
    async fetchUsers(startCursor = undefined, pageSize = 100) {
      console.log('fetchUsers')

      this.loading = true
      this.error = null

      try {
        const response = await userAPI.list({ startCursor, pageSize })
        this.users = response.data.results

        return response.data // Retorna { results, has_more, next_cursor }
      } catch (error) {
        this.error = error.response?.data?.message || error.message
        console.error('❌ ERRO ao buscar users:', this.error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // fetch ALL users (usando endpoint do backend)
    async fetchAllUsers() {
      this.loading = true
      this.error = null

      try {
        const response = await userAPI.list()
        this.users = response.data.results

        return response.data.results
      } catch (error) {
        this.error = error.response?.data?.message || error.message
        console.error('❌ ERRO ao buscar users:', this.error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // fetch specific user by ID
    async fetchUser(userId) {
      console.log('fetchUser')
      this.loading = true
      this.error = null

      try {
        if (!userId) {
          throw new Error('User ID is required')
        }

        const response = await userAPI.getById(userId)
        const data = response.data

        // Update user in the list if it exists, otherwise add it
        const index = this.users.findIndex((u) => u.id === userId)
        if (index !== -1) {
          this.users[index] = data
        } else {
          this.users.push(data)
        }

        this.userActive = data
        return data
      } catch (error) {
        this.error = error.response?.data?.message || error.message
        console.error('❌ ERRO ao buscar user:', this.error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // salva o ID do usuário ativo no localStorage
    saveActiveUser(userId) {
      localStorage.setItem('USER_LOGADO', userId)
    },

    // carrega o ID do usuário ativo do localStorage
    loadActiveUser() {
      const userId = localStorage.getItem('USER_LOGADO')
      if (userId) {
        this.userActive = userId
        return true
      }
      return false
    },

    // set active user
    setActiveUser(userId) {
      const user = this.users.find((u) => u.id === userId)
      if (user) {
        this.userActive = user
        this.isGuest = false
        this.saveActiveUser(userId)
      }
    },

    // entrar como visitante
    setGuestUser() {
      this.userActive = {
        id: 'guest',
        name: 'Visitante',
        type: 'guest'
      }
      this.isGuest = true
      localStorage.setItem('USER_LOGADO', 'guest')
      localStorage.setItem('IS_GUEST', 'true')
    },

    // verifica se o usuário atual é visitante
    checkIfGuest() {
      const isGuest = localStorage.getItem('IS_GUEST') === 'true'
      const userId = localStorage.getItem('USER_LOGADO')

      if (isGuest && userId === 'guest') {
        this.isGuest = true
        this.userActive = {
          id: 'guest',
          name: 'Visitante',
          type: 'guest'
        }
        return true
      }
      return false
    },

    // clear active user
    clearActiveUser() {
      this.userActive = null
      this.isGuest = false
      localStorage.removeItem('USER_LOGADO')
      localStorage.removeItem('IS_GUEST')
    },
  },
})
