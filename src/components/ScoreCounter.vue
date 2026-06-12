<script setup lang="ts">
defineProps<{
  score: number
}>()
</script>

<template>
  <div class="rounded-md bg-paco-secondary px-3 py-2 text-sm font-bold text-paco-card">
    Aciertos {{ score }}
  </div>
</template>
