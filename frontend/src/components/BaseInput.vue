<script setup>
defineProps({
  id: String,
  label: String,
  modelValue: String,
  type: {
    type: String,
    default: 'text'
  },
  required: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])
</script>

<template>
  <label :for="id">{{ label }}</label>

  <input
    :id="id"
    :type="type"
    :value="modelValue"
    :required="required"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<style scoped>
input {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

@media (max-width: 600px) {
  input {
    font-size: 16px;
  }
}
</style>