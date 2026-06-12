<script setup lang="ts">
defineProps<{
  isCorrect: boolean | null
  correctName: string
}>()
</script>

<template>
  <div
    v-if="isCorrect !== null"
    class="rounded-md px-4 py-3 text-center text-sm font-black"
    :class="isCorrect ? 'bg-paco-correct text-paco-bg' : 'bg-paco-incorrect text-white'"
    role="status"
    aria-live="polite"
  >
    <span v-if="isCorrect">Correcto. Ese PACO era {{ correctName }}.</span>
    <span v-else>Incorrecto. Era {{ correctName }}.</span>
  </div>
</template>
