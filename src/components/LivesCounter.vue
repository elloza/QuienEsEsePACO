<script setup lang="ts">
defineProps<{
  lives: number
}>()
</script>

<template>
  <div class="rounded-md bg-paco-secondary px-3 py-2 text-sm font-bold text-paco-card" aria-label="Vidas">
    <span aria-hidden="true">♥</span> {{ lives }}
  </div>
</template>
