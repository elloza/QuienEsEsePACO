<script setup lang="ts">
defineProps<{
  imageUrl: string
  animateIncorrect?: boolean
}>()
</script>

<template>
  <section
    class="rounded-lg bg-paco-card p-4 text-paco-bg shadow-paco"
    :class="animateIncorrect ? 'animate-shake' : 'animate-pop'"
  >
    <img
      :src="imageUrl"
      alt="Cara de la pregunta actual"
      class="mx-auto aspect-square w-full max-w-[21rem] rounded-md object-cover"
    />
  </section>
</template>
