<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import { useRouter } from 'vue-router'

import ExtraLifeAnimation from '@/components/ExtraLifeAnimation.vue'
import FaceCard from '@/components/FaceCard.vue'
import FeedbackBanner from '@/components/FeedbackBanner.vue'
import GameHeader from '@/components/GameHeader.vue'
import NameOptionButton from '@/components/NameOptionButton.vue'
import PacoLogo from '@/components/PacoLogo.vue'
import PrimaryButton from '@/components/PrimaryButton.vue'
import { gameConfig } from '@/config/gameConfig'
import { useDataset } from '@/composables/useDataset'
import { useGame } from '@/composables/useGame'

type GameController = ReturnType<typeof useGame>

const router = useRouter()
const { faces, names, isLoading, error, loadDataset, resolveImageUrl } = useDataset()
const game = shallowRef<GameController | null>(null)
const showExtraLife = ref(false)

onMounted(async () => {
  await loadDataset()
  if (faces.value.length > 0) {
    game.value = useGame(faces.value, names.value)
    game.value.start()
  }
})

watch(
  () => game.value?.state.earnedLives,
  (earnedLives, previousEarnedLives) => {
    if (earnedLives !== undefined && previousEarnedLives !== undefined && earnedLives > previousEarnedLives) {
      showExtraLife.value = true
      window.setTimeout(() => {
        showExtraLife.value = false
      }, 900)
    }
  },
)

const currentQuestion = computed(() => game.value?.state.currentQuestion ?? null)
const currentImage = computed(() => (currentQuestion.value ? resolveImageUrl(currentQuestion.value.face) : ''))
const revealAnswers = computed(() => game.value?.state.status === 'feedback' || game.value?.state.status === 'finished')

const chooseName = (name: string) => {
  const result = game.value?.answer(name)

  window.setTimeout(() => {
    if (result !== null && result !== undefined) {
      router.push('/result')
      return
    }

    game.value?.nextQuestion()
  }, gameConfig.feedbackDelayMs)
}

const restart = () => {
  game.value?.start()
}
</script>

<template>
  <main class="mx-auto min-h-screen w-full max-w-3xl px-4 py-5">
    <ExtraLifeAnimation :show="showExtraLife" />

    <div v-if="isLoading" class="grid min-h-screen place-items-center text-center">
      <p class="text-lg font-black text-paco-card">Cargando PACOS...</p>
    </div>

    <div v-else-if="error" class="grid min-h-screen place-items-center text-center">
      <section class="rounded-lg bg-paco-card p-5 text-paco-bg">
        <p class="font-black">{{ error }}</p>
        <PrimaryButton class="mt-4" @click="loadDataset">Reintentar</PrimaryButton>
      </section>
    </div>

    <div v-else-if="game && currentQuestion" class="flex min-h-screen flex-col gap-4 pb-5">
      <GameHeader :lives="game.state.lives" :score="game.state.score" :streak="game.state.streak">
        <template #logo>
          <PacoLogo />
        </template>
      </GameHeader>

      <div class="flex items-center justify-between text-sm font-bold text-paco-card/80">
        <span>Pregunta {{ game.state.questionNumber }}</span>
        <span>Mejor racha {{ game.state.bestStreak }}</span>
      </div>

      <FaceCard :image-url="currentImage" :animate-incorrect="game.state.isCorrect === false" />

      <FeedbackBanner :is-correct="game.state.isCorrect" :correct-name="currentQuestion.correctName" />

      <section class="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label="Opciones de nombre">
        <NameOptionButton
          v-for="option in currentQuestion.options"
          :key="`${currentQuestion.questionNumber}-${option}`"
          :name="option"
          :disabled="!game.canAnswer.value"
          :selected="game.state.selectedName === option"
          :is-correct-answer="currentQuestion.correctName === option"
          :reveal="revealAnswers"
          @click="chooseName(option)"
        />
      </section>
    </div>

    <div v-else class="grid min-h-screen place-items-center">
      <PrimaryButton @click="restart">Empezar partida</PrimaryButton>
    </div>
  </main>
</template>
