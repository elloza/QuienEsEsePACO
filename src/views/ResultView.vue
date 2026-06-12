<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import GameOverCard from '@/components/GameOverCard.vue'
import PacoLogo from '@/components/PacoLogo.vue'
import type { GameResult } from '@/types/game'

const router = useRouter()
const fallbackResult: GameResult = {
  score: 0,
  bestStreak: 0,
  earnedLives: 0,
  questionsPlayed: 0,
  finishedAt: new Date().toISOString(),
}

const result = computed(() => {
  const rawResult = localStorage.getItem('paco:lastResult')

  if (rawResult === null) {
    return fallbackResult
  }

  try {
    return JSON.parse(rawResult) as GameResult
  } catch {
    return fallbackResult
  }
})

const message = computed(() => {
  if (result.value.score >= 20) {
    return 'Nivel laboratorio PACO: precisión preocupante.'
  }

  if (result.value.score >= 10) {
    return 'Buen ojo. La ciencia pacológica avanza.'
  }

  if (result.value.score >= 4) {
    return 'Hay intuición, pero todavía hay PACOS ocultos.'
  }

  return 'La muestra no es concluyente. Repite el experimento.'
})
</script>

<template>
  <main class="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-5 py-6">
    <PacoLogo />
    <GameOverCard :result="result" :message="message" @restart="router.push('/play')" />
  </main>
</template>
