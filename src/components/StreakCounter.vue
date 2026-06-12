<script setup lang="ts">
defineProps<{
  streak: number
}>()
</script>

<template>
  <div class="rounded-md bg-paco-secondary px-3 py-2 text-sm font-bold text-paco-card">
    Racha {{ streak }}
  </div>
</template>
