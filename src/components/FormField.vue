<template>
  <div class="form-field" :class="{ 'form-field--required': required }">
    <label :for="fieldId" class="form-field__label">
      {{ label }}
      <span v-if="required" class="form-field__asterisk">*</span>
    </label>

    <div class="form-field__input-wrapper">
      <select v-if="type === 'select'" :id="fieldId" v-model="localValue" class="form-field__input form-field__select"
        :class="{ 'form-field__input--error': error }" @change="$emit('update:modelValue', $event.target.value)">
        <option value="" disabled>{{ placeholder || 'Selecione uma opção' }}</option>
        <option v-for="option in options" :key="option" :value="option">
          {{ option }}
        </option>
      </select>

      <input v-else-if="type === 'checkbox'" :id="fieldId" type="checkbox" v-model="localValue"
        class="form-field__checkbox" @change="$emit('update:modelValue', $event.target.checked)" />

      <input v-else :id="fieldId" :type="inputType" v-model="localValue" :placeholder="placeholder"
        class="form-field__input" :class="{ 'form-field__input--error': error }"
        @input="$emit('update:modelValue', $event.target.value)" />
    </div>

    <span v-if="error" class="form-field__error">{{ error }}</span>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

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
    default:
      return 'text'
  }
});

</script>

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
  /* // position: relative; */
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
}

.form-field__checkbox {
  width: 1rem;
  height: 1rem;
  accent-color: var(--accent);
  cursor: pointer;
}

.form-field__error {
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
