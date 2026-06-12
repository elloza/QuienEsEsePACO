import { computed, reactive } from 'vue'

import { gameConfig } from '@/config/gameConfig'
import { useSeededRandom } from '@/composables/useSeededRandom'
import type { FaceEntry, GameQuestion, GameResult, GameState } from '@/types/game'

const storageKey = 'paco:lastResult'

export function useGame(faces: FaceEntry[], allNames: string[]) {
  const random = useSeededRandom()

  const state = reactive<GameState>({
    lives: gameConfig.initialLives,
    score: 0,
    streak: 0,
    bestStreak: 0,
    earnedLives: 0,
    questionNumber: 1,
    status: 'ready',
    selectedName: null,
    isCorrect: null,
    currentQuestion: null,
  })

  const canAnswer = computed(() => state.status === 'playing' && state.currentQuestion !== null)

  const buildQuestion = (): GameQuestion => {
    const face = random.pick(faces)
    const distractors = random
      .shuffle(allNames.filter((name) => name !== face.name))
      .slice(0, gameConfig.optionCount - 1)
    const options = random.shuffle([face.name, ...distractors])

    return {
      face,
      options,
      correctName: face.name,
      questionNumber: state.questionNumber,
    }
  }

  const start = () => {
    state.lives = gameConfig.initialLives
    state.score = 0
    state.streak = 0
    state.bestStreak = 0
    state.earnedLives = 0
    state.questionNumber = 1
    state.status = 'playing'
    state.selectedName = null
    state.isCorrect = null
    state.currentQuestion = buildQuestion()
  }

  const buildResult = (): GameResult => ({
    score: state.score,
    bestStreak: state.bestStreak,
    earnedLives: state.earnedLives,
    questionsPlayed: state.questionNumber,
    finishedAt: new Date().toISOString(),
  })

  const finish = () => {
    state.status = 'finished'
    const result = buildResult()
    localStorage.setItem(storageKey, JSON.stringify(result))
    window.dispatchEvent(new CustomEvent('paco-game-finished', { detail: result }))
    return result
  }

  const nextQuestion = () => {
    state.questionNumber += 1
    state.selectedName = null
    state.isCorrect = null
    state.status = 'playing'
    state.currentQuestion = buildQuestion()
  }

  const answer = (name: string) => {
    if (!canAnswer.value || state.currentQuestion === null) {
      return null
    }

    state.status = 'feedback'
    state.selectedName = name
    state.isCorrect = name === state.currentQuestion.correctName

    if (state.isCorrect) {
      state.score += 1
      state.streak += 1
      state.bestStreak = Math.max(state.bestStreak, state.streak)

      if (state.score % gameConfig.extraLifeEvery === 0) {
        state.lives += 1
        state.earnedLives += 1
      }
    } else {
      state.lives -= 1
      state.streak = 0
    }

    return state.lives <= 0 ? finish() : null
  }

  return {
    state,
    canAnswer,
    start,
    answer,
    nextQuestion,
  }
}
