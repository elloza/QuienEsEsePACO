<script setup lang="ts">
const props = defineProps<{
  name: string
  disabled: boolean
  selected: boolean
  isCorrectAnswer: boolean
  reveal: boolean
}>()

const stateClasses = () => {
  if (!props.reveal) {
    return 'bg-paco-card text-paco-bg hover:bg-paco-accent focus-visible:outline-paco-accent'
  }

  if (props.isCorrectAnswer) {
    return 'bg-paco-correct text-paco-bg focus-visible:outline-paco-correct'
  }

  if (props.selected) {
    return 'bg-paco-incorrect text-white focus-visible:outline-paco-incorrect'
  }

  return 'bg-paco-card/70 text-paco-bg'
}
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    class="min-h-11 rounded-md px-4 py-2.5 text-base font-black shadow-paco transition focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 disabled:cursor-not-allowed sm:min-h-12 sm:py-3"
    :class="stateClasses()"
  >
    {{ name }}
  </button>
</template>
