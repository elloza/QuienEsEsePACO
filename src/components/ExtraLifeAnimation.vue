<script setup lang="ts">
defineProps<{
  show: boolean
}>()
</script>

<template>
  <div
    v-if="show"
    class="pointer-events-none fixed left-1/2 top-24 z-20 -translate-x-1/2 animate-floatUp rounded-md bg-paco-accent px-4 py-2 text-sm font-black text-paco-bg shadow-paco"
    role="status"
    aria-live="polite"
  >
    +1 vida
  </div>
</template>
