<template>
  <div class="pagination">
    <div class="pagination__info">
      Mostrando {{ bookCount }} {{ bookCount === 1 ? 'livro' : 'livros' }}
    </div>

    <div class="pagination__controls">
      <button @click="$emit('previous')" :disabled="!hasPrevious" >
        ← Anterior
      </button>

      <button @click="$emit('next')" :disabled="!hasNext" >
        Próximo →
      </button>
    </div>

    <div class="pagination__page-size-selector">
      <label>Itens por página:</label>
      <select :value="pageSize" @change="$emit('changeSize', Number($event.target.value))" >
        <option value="9">9</option>
        <option value="18">18</option>
        <option value="36">36</option>
        <option value="50">50</option>
      </select>
    </div>
  </div>
</template>

<script setup>
defineProps({
  bookCount: { type: Number, required: true },
  pageSize: { type: Number, required: true },
  hasPrevious: { type: Boolean, required: true },
  hasNext: { type: Boolean, required: true },
})

defineEmits(['previous', 'next', 'changeSize']);
</script>

<style scoped>
.pagination {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  border: 1px solid #e5e7eb;
  background: transparent;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: var(--box-shadow);
}

.pagination__info {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.pagination__controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.pagination__btn--primary {
  padding: 0.5rem 1.5rem;
  border: 1px solid #d1d5db;
  background: var(--white);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.pagination__btn--primary:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: var(--accent);
  transform: translateY(-1px);
}

.pagination__btn--primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination__page-size-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.pagination__select--primary {
  padding: 0.375rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: var(--white);
  cursor: pointer;
  transition: all 0.2s;
}

.pagination__select--primary:hover {
  border-color: var(--accent);
}

.pagination__select--primary:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

@media (max-width: 640px) {
  .pagination {
    padding: 1rem 0.75rem;
  }

  .pagination__controls {
    width: 100%;
    justify-content: space-between;
  }

  .pagination__btn--primary {
    flex: 1;
    padding: 0.625rem 1rem;
  }
}
</style>
