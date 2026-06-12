<script setup lang="ts">
import type { GameResult } from '@/types/game'
import PrimaryButton from '@/components/PrimaryButton.vue'

defineProps<{
  result: GameResult
  message: string
}>()

defineEmits<{
  restart: []
}>()
</script>

<template>
  <section class="rounded-lg bg-paco-card p-5 text-paco-bg shadow-paco">
    <h1 class="text-3xl font-black">Resultado</h1>
    <p class="mt-2 text-base font-bold">{{ message }}</p>
    <dl class="mt-5 grid grid-cols-2 gap-3 text-sm">
      <div class="rounded-md bg-white p-3">
        <dt class="font-bold text-paco-secondary">Aciertos</dt>
        <dd class="text-2xl font-black">{{ result.score }}</dd>
      </div>
      <div class="rounded-md bg-white p-3">
        <dt class="font-bold text-paco-secondary">Mejor racha</dt>
        <dd class="text-2xl font-black">{{ result.bestStreak }}</dd>
      </div>
      <div class="rounded-md bg-white p-3">
        <dt class="font-bold text-paco-secondary">Vidas extra</dt>
        <dd class="text-2xl font-black">{{ result.earnedLives }}</dd>
      </div>
      <div class="rounded-md bg-white p-3">
        <dt class="font-bold text-paco-secondary">Preguntas</dt>
        <dd class="text-2xl font-black">{{ result.questionsPlayed }}</dd>
      </div>
    </dl>
    <PrimaryButton class="mt-5 w-full" @click="$emit('restart')">Reiniciar</PrimaryButton>
  </section>
</template>
