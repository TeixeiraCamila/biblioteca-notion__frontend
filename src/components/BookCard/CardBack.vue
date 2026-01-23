<script setup>
import { computed } from 'vue'
import CardStatus from './CardStatus.vue'
import { PencilLine, Trash } from 'lucide-vue-next'
import { useBookStore } from '@/stores/bookStore'

const bookStore = useBookStore()

const props = defineProps({
  book: { type: Object, required: true },
  rotate: { type: String, required: false },
})

const emit = defineEmits(['edit'])

const statusClass = computed(() => {
  switch (props.book.status) {
    case 'Read':
      return 'status-read'
    case 'Reading':
      return 'status-reading'
    case 'DNF':
      return 'status-dnf'
    case 'To be read':
      return 'status-status-to-be-read'
    default:
      return 'status-default'
  }
})

const string = computed(() => {
  const publisher = props.book.publishedBy?.[0]
  const year = props.book.firstPublished

  if (publisher && year) {
    return `Published by ${publisher} in ${year}`
  }

  if (publisher) {
    return `Published by ${publisher}`
  }

  if (year) {
    return `First published in ${year}`
  }

  return ''
})

const startEndString = computed(() => {
  const se = props.book.startEnd

  if (!se?.start || !se?.end) return ''

  const start = new Date(se.start).toLocaleDateString('pt-BR')
  const end = new Date(se.end).toLocaleDateString('pt-BR')

  return `Lido de ${start} até ${end}`
})

const handleEdit = () => {
  emit('edit', props.book)
}

const handleDelete = async (bokId) => {
  if (confirm('Tem certeza que deseja deletar este livro?')) {
    bookStore.deleteBook(bokId)
  }
};
</script>

<template>
  <div class="card-back">
    <CardStatus :rotate="rotate" :book-status="book.status" />
    <div class="card-back__content">
      <div class="card-back__top">
        <p class="card-back__rate" v-if="book.rate" v-html="book.rate" />
      </div>

      <div class="card-back__info">
        <div class="card-back__label">
          <h4 class="card-back__title">{{ book.name }}</h4>
        </div>

        <p class="card-back__text" v-if="book.bookSeries">Série: {{ book.bookSeries }}</p>

        <p class="card-back__text" v-if="book.author?.length">
          <span v-if="book.literaryAtlas" v-html="book.literaryAtlas" />
          {{ book.author.join(', ') }}
        </p>

        <div v-if="book.total && book.currentlyOn">
          <p class="card-back__text">Páginas: {{ book.currentlyOn }} / {{ book.totalPages }}</p>
          <p class="card-back__text">Progresso: {{ book.currentlyOn }} / {{ book.total }}</p>
        </div>

        <p class="card-back__text" v-if="book.type?.length">Type: {{ book.type.join(', ') }}</p>

        <p class="card-back__text" v-if="string">
          {{ string }}
        </p>
        <p class="card-back__text" v-if="startEndString">
          {{ startEndString }}
        </p>

        <ul class="card-back__genres">
          <li v-for="(genre, index) in book.genres" :key="index" class="card-back__genre">
            {{ genre }}
          </li>
        </ul>
      </div>

      <div class="card-back__actions">
        <button class="card-back__action-btn">
          <PencilLine @click="handleEdit(book.id)" />
        </button>
        <button class="card-back__action-btn" @click="handleDelete(book.id)">
          <Trash />
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.card-back__content {
  display: grid;
  height: 100%;
  background: var(--white);
  border-radius: 8px;
}

.card-back__top {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  overflow: hidden;
  z-index: 11;
}

.card-back__info {
  padding: 0 1rem 1rem;
}

.card-back__title {
  margin: 0;
  font-size: 1rem;
}

.card-back__text {
  margin: 0.25rem 0;
  font-size: 0.85rem;
}

.card-back__genres {
  display: flex;
  gap: 1rem;
}

.card-back__genres .card-back__genre {
  padding: 3px 0.5rem;
  border: 1px solid var(--accent3);
  border-radius: 12px;
}

.card-back__actions {
  display: flex;
  gap: 1rem;
  padding: 0 1rem 1rem;
  place-self: flex-end;
}

.card-back__actions .card-back__action-btn {
  background-color: transparent;
  border: none;
  padding: 4px;
  border-radius: 12px;
  cursor: pointer;
  color: var(--text);
}

.card-back__actions .card-back__action-btn:hover {
  background-color: var(--accent_muted);
}
</style>
