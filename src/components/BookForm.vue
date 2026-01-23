<!-- component/BookForn.vue -->
<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useBookStore } from '@/stores/bookStore'
import { validateRequired, validatePositiveNumber, validateYear, parseCommaSeparated } from '@/utils/validation'
import { BOOK_STATUS, BOOK_RATE_LABELS } from '@/constants/book'
import { useNotifications } from '@/composables/useNotifications'
import FormSection from './FormSection.vue'
import FormField from './FormField.vue'
import FormActions from './FormActions.vue'
const props = defineProps({
  book: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  }
});
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
  startEnd: '',
  cover: '',
  literaryAtlas: '',
  genres: '',
  publishedBy: '',
  bookSeries: '',
})

const fieldErrors = ref({})
const isSubmitting = ref(false)

// Preencher formulário quando for edição
onMounted(() => {
  if (props.book && props.isEdit) {
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
    formData.startEnd = props.book.startEnd || ''
    formData.cover = props.book.cover?.join(', ') || ''
    formData.literaryAtlas = props.book.literaryAtlas || ''
    formData.genres = props.book.genres?.join(', ') || ''
    formData.publishedBy = props.book.publishedBy?.join(', ') || ''
    formData.bookSeries = props.book.bookSeries || ''
  }
})

const handleSubmit = async () => {
  // Resetar erros
  fieldErrors.value = {}

  // Validações
  const errors = {}


  if (validateRequired(formData.name, 'Título')) {
    errors.name = 'Título é obrigatório'
  }

  if (formData.totalPages && validatePositiveNumber(formData.totalPages, 'Total de páginas')) {
    errors.totalPages = 'Deve ser um número positivo'
  }

  if (formData.currentlyOn && validatePositiveNumber(formData.currentlyOn, 'Página atual')) {
    errors.currentlyOn = 'Deve ser um número positivo'
  }

  if (formData.firstPublished && !/^\d{4}$/.test(formData.firstPublished)) {
    errors.firstPublished = 'Formato: YYYY'
  }

  if (Object.keys(errors).length > 0) {
    fieldErrors.value = errors
    addNotification('Corrija os erros destacados', 'error')
    return
  }

  isSubmitting.value = true

  try {
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
      startEnd: formData.startEnd || undefined,
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

    // Resetar formulário
    Object.keys(formData).forEach(key => {
      if (typeof formData[key] === 'boolean') {
        formData[key] = false
      } else {
        formData[key] = ''
      }
    })

    emit('submit')
  } catch (error) {
    addNotification(`Erro ao ${props.isEdit ? 'atualizar' : 'criar'} livro`, 'error')
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  // Resetar formulário
  Object.keys(formData).forEach(key => {
    if (typeof formData[key] === 'boolean') {
      formData[key] = false
    } else {
      formData[key] = ''
    }
  })

  emit('cancel')
};
</script>

<template>
  <div class="book-form">
    <div class="book-form__header">
      <h2 class="book-form__title">
        {{ isEdit ? 'Editar Livro' : 'Adicionar Novo Livro' }}
      </h2>
      <button @click="handleCancel" class="book-form__close-btn">×</button>
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

      <!-- Leitura e Metadados -->
      <FormSection title="Leitura e Metadados">
        <div class="book-form__grid">
          <FormField
            v-model="formData.wasReadIn"
            label="Lido em"
            placeholder="Ex: 2023, Janeiro"
            :error="fieldErrors.wasReadIn"
          />

          <FormField
            v-model="formData.startEnd"
            label="Data de início/fim"
            placeholder="Ex: 2023-01-01/2023-01-15"
            :error="fieldErrors.startEnd"
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
