<script setup lang="ts">
defineProps<{
  imageUrl: string
  animateIncorrect?: boolean
}>()
</script>

<template>
  <section
    class="face-card-shell flex min-h-0 items-center justify-center rounded-lg bg-paco-card p-2 text-paco-bg shadow-paco sm:p-4"
    :class="animateIncorrect ? 'animate-shake' : 'animate-pop'"
  >
    <div class="face-card-frame overflow-hidden rounded-md">
      <img :src="imageUrl" alt="Cara de la pregunta actual" class="h-full w-full object-cover object-center" />
    </div>
  </section>
</template>

<style scoped>
.face-card-shell {
  container-type: size;
}

.face-card-frame {
  aspect-ratio: 1 / 1;
  width: min(100cqw, 100cqh, 24rem);
}

@supports not (width: 1cqw) {
  .face-card-frame {
    aspect-ratio: 1 / 1;
    height: min(100%, 24rem);
    max-width: min(100%, 24rem);
  }
}
</style>
