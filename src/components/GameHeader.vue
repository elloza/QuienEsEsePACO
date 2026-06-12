<script setup lang="ts">
import LivesCounter from '@/components/LivesCounter.vue'
import ScoreCounter from '@/components/ScoreCounter.vue'
import StreakCounter from '@/components/StreakCounter.vue'

defineProps<{
  lives: number
  score: number
  streak: number
}>()
</script>

<template>
  <header class="flex flex-wrap items-center justify-between gap-3">
    <slot name="logo" />
    <div class="flex flex-wrap items-center gap-2">
      <LivesCounter :lives="lives" />
      <ScoreCounter :score="score" />
      <StreakCounter :streak="streak" />
    </div>
  </header>
</template>
