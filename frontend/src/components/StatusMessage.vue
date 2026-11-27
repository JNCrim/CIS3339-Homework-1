
<script setup>
defineProps({
  message: {
    type: String,
    default: ''
  },
  errorMessage: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <p v-if="message" class="success" role="status">
    {{ message }}
  </p>

  <p v-if="errorMessage" class="error" role="alert">
    {{ errorMessage }}
  </p>
</template>

<style scoped>
.success {
  color: #42b883;
}

.error {
  color: #ff5555;
}
</style>
