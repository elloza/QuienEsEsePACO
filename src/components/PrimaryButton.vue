<script setup lang="ts">
defineProps<{
  type?: 'button' | 'submit'
}>()
</script>

<template>
  <button
    :type="type ?? 'button'"
    class="min-h-11 rounded-md bg-paco-accent px-5 py-3 text-base font-black text-paco-bg shadow-paco transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
  >
    <slot />
  </button>
</template>
