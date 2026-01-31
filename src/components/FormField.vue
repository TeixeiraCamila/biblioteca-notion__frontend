<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: ''
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  // labels customizados
  labels: {
    type: Object,
    default: null
  },
  // inputs numéricos
  min: {
    type: [String, Number],
    default: undefined
  },
  max: {
    type: [String, Number],
    default: undefined
  },
  step: {
    type: [String, Number],
    default: undefined
  }
})

const emit = defineEmits(['update:modelValue'])

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const fieldId = computed(() => `field-${Math.random().toString(36).substr(2, 9)}`)

const inputType = computed(() => {
  switch (props.type) {
    case 'number':
      return 'number'
    case 'email':
      return 'email'
    case 'date':
      return 'date'
    case 'password':
      return 'password'
    case 'url':
      return 'url'
    default:
      return 'text'
  }
});
</script>

<template>
  <div class="form-field" :class="{ 'form-field--required': required }">
    <label :for="fieldId" class="form-field__label">
      {{ label }}
      <span v-if="required" class="form-field__asterisk">*</span>
    </label>

    <div class="form-field__input-wrapper">
      <!-- Select com suporte a labels customizados -->
      <select v-if="type === 'select'" :id="fieldId" v-model="localValue" class="form-field__input form-field__select"
        :class="{ 'form-field__input--error': error }" @change="$emit('update:modelValue', $event.target.value)">
        <option value="" disabled>{{ placeholder || 'Selecione uma opção' }}</option>
        <!-- ✅ CORRIGIDO: Suporte a labels customizados -->
        <option v-for="option in options" :key="option" :value="option">
          {{ labels ? labels[option] : option }}
        </option>
      </select>

      <!-- Checkbox -->
      <input v-else-if="type === 'checkbox'" :id="fieldId" type="checkbox" v-model="localValue"
        class="form-field__checkbox" @change="$emit('update:modelValue', $event.target.checked)" />

      <!-- Outros tipos de input -->
      <input v-else :id="fieldId" :type="inputType" v-model="localValue" :placeholder="placeholder" :min="min"
        :max="max" :step="step" class="form-field__input" :class="{ 'form-field__input--error': error }"
        @input="$emit('update:modelValue', $event.target.value)" />
    </div>

    <span v-if="error" class="form-field__error">{{ error }}</span>
  </div>
</template>


<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field__label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.form-field__asterisk {
  color: #dc2626;
  font-weight: 700;
}

.form-field__input-wrapper {
  position: relative;
}

.form-field__input {
  border: 2px solid #878a8f;
  border-right: none;
  border-top: none;
  background: transparent;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #374151;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.2s;
}

.form-field__input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(218, 147, 143, 0.1);
}

.form-field__input:hover:not(:focus) {
  border-color: #6b7280;
}

.form-field__input--error {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.form-field__select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2.5rem;
}

.form-field__checkbox {
  width: 1.25rem;
  height: 1.25rem;
  accent-color: var(--accent);
  cursor: pointer;
}

.form-field__error {
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.form-field__error::before {
  content: '⚠';
}
</style>
