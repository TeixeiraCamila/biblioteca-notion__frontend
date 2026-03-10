<!-- component/BookForm.vue -->
<script setup>
import { reactive, ref, onMounted, watch } from 'vue'
import { useBookStore } from '@/stores/bookStore'
import { BOOK_STATUS, BOOK_RATE_LABELS } from '@/constants/book'
import { useNotifications } from '@/composables/useNotifications'
import FormSection from '../FormSection.vue'
import FormField from '../FormField.vue'
import FormActions from '../FormActions.vue'
import Button from '../../ui/Button.vue'
const props = defineProps({
  book: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['cancel', 'submit'])
const bookStore = useBookStore()
const { addNotification } = useNotifications()

const formData = reactive({
  name: '',
  author: '',
  status: '',
  rate: '',
  totalPages: '',
  currentlyOn: '',
  type: '',
  firstPublished: '',
  iHaveCopy: false,
  wasReadIn: '',
  startDate: '',
  endDate: '',
  cover: '',
  literaryAtlas: '',
  genres: '',
  publishedBy: '',
  bookSeries: '',
})

const fieldErrors = ref({})
const isSubmitting = ref(false)

onMounted(() => {
  if (props.book && props.isEdit) {
    // Preencher campos básicos
    formData.name = props.book.name || ''
    formData.author = props.book.author?.join(', ') || ''
    formData.status = props.book.status || ''
    formData.rate = props.book.rate || ''
    formData.totalPages = props.book.totalPages || ''
    formData.currentlyOn = props.book.currentlyOn || ''
    formData.type = props.book.type?.join(', ') || ''
    formData.firstPublished = props.book.firstPublished || ''
    formData.iHaveCopy = props.book.iHaveCopy || false
    formData.wasReadIn = props.book.wasReadIn?.join(', ') || ''
    formData.cover = props.book.cover?.join(', ') || ''
    formData.literaryAtlas = props.book.literaryAtlas || ''
    formData.genres = props.book.genres?.join(', ') || ''
    formData.publishedBy = props.book.publishedBy?.join(', ') || ''
    formData.bookSeries = props.book.bookSeries || ''

    // Parsing robusto de startEnd
    parseStartEndData(props.book.startEnd)
  }
})

// Função auxiliar para parsing robusto de startEnd
const parseStartEndData = (startEndData) => {
  if (!startEndData) {
    formData.startDate = ''
    formData.endDate = ''
    return
  }

  try {
    // Caso 1: startEnd é um objeto com start e end
    if (typeof startEndData === 'object' && startEndData !== null) {
      formData.startDate = startEndData.start || ''
      formData.endDate = startEndData.end || ''
    }
    // Caso 2: startEnd é uma string no formato "YYYY-MM-DD/YYYY-MM-DD"
    else if (typeof startEndData === 'string') {
      const [start, end] = startEndData.split('/')
      formData.startDate = start?.trim() || ''
      formData.endDate = end?.trim() || ''
    }
    // Caso 3: startEnd é um array
    else if (Array.isArray(startEndData)) {
      formData.startDate = startEndData[0] || ''
      formData.endDate = startEndData[1] || ''
    }
    // Caso 4: startEnd é um único valor (pode ser start ou end)
    else {
      formData.startDate = ''
      formData.endDate = ''
    }
  } catch (error) {
    console.warn('Erro ao parsear startEnd:', error)
    formData.startDate = ''
    formData.endDate = ''
  }
}

// Watch para atualizar o form quando o livro mudar (caso o book seja carregado assíncronamente)
watch(() => props.book, (newBook) => {
  if (newBook && props.isEdit) {
    // Atualizar todos os campos
    formData.name = newBook.name || ''
    formData.author = newBook.author?.join(', ') || ''
    formData.status = newBook.status || ''
    formData.rate = newBook.rate || ''
    formData.totalPages = newBook.totalPages || ''
    formData.currentlyOn = newBook.currentlyOn || ''
    formData.type = newBook.type?.join(', ') || ''
    formData.firstPublished = newBook.firstPublished || ''
    formData.iHaveCopy = newBook.iHaveCopy || false
    formData.wasReadIn = newBook.wasReadIn?.join(', ') || ''
    formData.cover = newBook.cover?.join(', ') || ''
    formData.literaryAtlas = newBook.literaryAtlas || ''
    formData.genres = newBook.genres?.join(', ') || ''
    formData.publishedBy = newBook.publishedBy?.join(', ') || ''
    formData.bookSeries = newBook.bookSeries || ''

    // Atualizar startEnd
    parseStartEndData(newBook.startEnd)
  }
}, { immediate: true })

// Função auxiliar para parsing de valores separados por vírgula
const parseCommaSeparated = (value) => {
  if (!value) return []
  return value
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0)
}

const handleSubmit = async () => {
  // Resetar erros
  fieldErrors.value = {}

  const errors = {}

  // Validação de título
  if (!formData.name || !formData.name.trim()) {
    errors.name = 'Título é obrigatório'
  }

  //  Validação de autor
  if (!formData.author || !formData.author.trim()) {
    errors.author = 'Autor é obrigatório'
  }

  // Validação de total de páginas
  if (formData.totalPages) {
    const pages = Number(formData.totalPages)
    if (isNaN(pages) || pages < 0) {
      errors.totalPages = 'Deve ser um número positivo'
    }
  }

  // Validação de página atual
  if (formData.currentlyOn) {
    const current = Number(formData.currentlyOn)
    if (isNaN(current) || current < 0) {
      errors.currentlyOn = 'Deve ser um número positivo'
    }

    // Validar que página atual não seja maior que total
    if (formData.totalPages && current > Number(formData.totalPages)) {
      errors.currentlyOn = 'Página atual não pode ser maior que o total'
    }
  }

  // Validação de ano
  if (formData.firstPublished) {
    const year = Number(formData.firstPublished)
    const currentYear = new Date().getFullYear()

    if (!/^\d{4}$/.test(formData.firstPublished)) {
      errors.firstPublished = 'Formato: YYYY (4 dígitos)'
    } else if (year < 1000 || year > currentYear + 1) {
      errors.firstPublished = `Ano deve estar entre 1000 e ${currentYear + 1}`
    }
  }

  //  Validação de datas
  if (formData.startDate && formData.endDate) {
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)

    if (start > end) {
      errors.endDate = 'Data de término deve ser posterior à data de início'
    }
  }

  if (Object.keys(errors).length > 0) {
    fieldErrors.value = errors
    addNotification('Corrija os erros destacados', 'error')
    return
  }

  isSubmitting.value = true

  try {
    // Montar startEnd corretamente
    let startEndValue = undefined
    if (formData.startDate || formData.endDate) {
      startEndValue = {
        start: formData.startDate || undefined,
        end: formData.endDate || undefined
      }
    }

    const bookData = {
      name: formData.name.trim(),
      author: parseCommaSeparated(formData.author),
      status: formData.status || undefined,
      rate: formData.rate || undefined,
      totalPages: formData.totalPages ? Number(formData.totalPages) : undefined,
      currentlyOn: formData.currentlyOn ? Number(formData.currentlyOn) : undefined,
      type: parseCommaSeparated(formData.type),
      firstPublished: formData.firstPublished || undefined,
      iHaveCopy: formData.iHaveCopy,
      wasReadIn: parseCommaSeparated(formData.wasReadIn),
      startEnd: startEndValue,
      cover: parseCommaSeparated(formData.cover),
      literaryAtlas: formData.literaryAtlas || undefined,
      genres: parseCommaSeparated(formData.genres),
      publishedBy: parseCommaSeparated(formData.publishedBy),
      bookSeries: formData.bookSeries || undefined,
    }

    if (props.isEdit && props.book) {
      await bookStore.updateBook(props.book.id, bookData)
      addNotification('Livro atualizado com sucesso!', 'success')
    } else {
      await bookStore.createBook(bookData)
      addNotification('Livro criado com sucesso!', 'success')
    }

    // Resetar formulário apenas se for criação, não edição
    if (!props.isEdit) {
      Object.keys(formData).forEach(key => {
        if (typeof formData[key] === 'boolean') {
          formData[key] = false
        } else {
          formData[key] = ''
        }
      })
    }

    emit('submit')
  } catch (error) {
    addNotification(`Erro ao ${props.isEdit ? 'atualizar' : 'criar'} livro`, 'error')
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  // Resetar formulário apenas se for criação, não edição
  if (!props.isEdit) {
    Object.keys(formData).forEach(key => {
      if (typeof formData[key] === 'boolean') {
        formData[key] = false
      } else {
        formData[key] = ''
      }
    })
  }

  emit('cancel')
};
</script>

<template>
  <div class="book-form">
    <div class="book-form__header">
      <h2 class="book-form__title">
        {{ isEdit ? 'Editar Livro' : 'Adicionar Novo Livro' }}
      </h2>
      <Button @click="handleCancel" class="book-form__close-btn" variant="secondary">×</Button>
    </div>

    <form @submit.prevent="handleSubmit" class="book-form__content">
      <!-- Informações Básicas -->
      <FormSection title="Informações Básicas">
        <div class="book-form__grid">
          <FormField
            v-model="formData.name"
            label="Título"
            placeholder="Ex: 1984"
            required
            :error="fieldErrors.name"
          />

          <FormField
            v-model="formData.author"
            label="Autor"
            placeholder="Ex: George Orwell"
            required
            :error="fieldErrors.author"
          />
        </div>
      </FormSection>

      <!-- Status e Progresso -->
      <FormSection title="Status e Progresso">
        <div class="book-form__grid">
          <FormField
            v-model="formData.status"
            label="Status"
            type="select"
            :options="BOOK_STATUS"
            :error="fieldErrors.status"
          />

          <FormField
            v-model="formData.totalPages"
            label="Total de páginas"
            type="number"
            placeholder="Ex: 350"
            :error="fieldErrors.totalPages"
          />

          <FormField
            v-if="formData.status === 'Reading'"
            v-model="formData.currentlyOn"
            label="Página atual"
            type="number"
            placeholder="Ex: 125"
            :error="fieldErrors.currentlyOn"
          />
        </div>
      </FormSection>

      <!-- Avaliação e Classificação -->
      <FormSection title="Avaliação e Classificação">
        <div class="book-form__grid">
          <FormField
            v-model="formData.rate"
            label="Avaliação"
            type="select"
            :options="Object.keys(BOOK_RATE_LABELS)"
            :labels="BOOK_RATE_LABELS"
            placeholder="Selecione uma avaliação"
            :error="fieldErrors.rate"
          />

          <FormField
            v-model="formData.type"
            label="Tipo/Gênero"
            placeholder="Ex: Ficção, Romance, Técnico"
            :error="fieldErrors.type"
          />

          <FormField
            v-model="formData.genres"
            label="Gêneros/Tags"
            placeholder="Ex: Ficção Científica, Distopia"
            :error="fieldErrors.genres"
          />
        </div>
      </FormSection>

      <!-- Detalhes da Publicação -->
      <FormSection title="Detalhes da Publicação">
        <div class="book-form__grid">
          <FormField
            v-model="formData.firstPublished"
            label="Ano de publicação"
            type="number"
            placeholder="Ex: 1949"
            :error="fieldErrors.firstPublished"
          />

          <FormField
            v-model="formData.publishedBy"
            label="Publicado por"
            placeholder="Ex: Editora A, Editora B"
            :error="fieldErrors.publishedBy"
          />

          <FormField
            v-model="formData.bookSeries"
            label="Série do livro"
            placeholder="Ex: Harry Potter"
            :error="fieldErrors.bookSeries"
          />

          <div class="book-form__checkbox-field">
            <FormField
              v-model="formData.iHaveCopy"
              label="Possuo cópia física"
              type="checkbox"
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Leitura e Metadados">
        <div class="book-form__grid">
          <FormField
            v-model="formData.wasReadIn"
            label="Lido em"
            placeholder="Ex: 2023, Janeiro"
            :error="fieldErrors.wasReadIn"
          />

          <FormField
            v-model="formData.startDate"
            label="Data de início"
            type="date"
            :error="fieldErrors.startDate"
          />

          <FormField
            v-model="formData.endDate"
            label="Data de término"
            type="date"
            :error="fieldErrors.endDate"
          />

          <FormField
            v-model="formData.literaryAtlas"
            label="Atlas literário"
            placeholder="Ex: Clássicos, Contemporâneo"
            :error="fieldErrors.literaryAtlas"
          />

          <FormField
            v-model="formData.cover"
            label="Capa (URLs)"
            placeholder="Ex: https://example.com/cover.jpg"
            :error="fieldErrors.cover"
          />
        </div>
      </FormSection>

      <!-- Ações -->
      <FormActions
        :is-submitting="isSubmitting"
        :is-loading="bookStore.loading"
        submit-text="Salvar Livro"
        cancel-text="Cancelar"
        @cancel="handleCancel"
      />
    </form>
  </div>
</template>

<style scoped>
.book-form {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
}

.book-form__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.book-form__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.book-form__close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.book-form__close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.book-form__content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.book-form__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.book-form__checkbox-field {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(218, 147, 143, 0.05);
  border-radius: 0.5rem;
  border: 1px solid var(--accent_muted);
}

/* Responsividade */
@media (max-width: 768px) {
  .book-form__content {
    padding: 1rem;
  }

  .book-form__grid {
    grid-template-columns: 1fr;
  }
}
</style>
