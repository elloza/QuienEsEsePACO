<script setup lang="ts">
import { useRouter } from 'vue-router'

import PacoLogo from '@/components/PacoLogo.vue'
import PrimaryButton from '@/components/PrimaryButton.vue'
import { gameConfig } from '@/config/gameConfig'

const router = useRouter()
</script>

<template>
  <main class="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 py-6">
    <PacoLogo />

    <section class="flex flex-1 flex-col justify-center py-8">
      <p class="text-sm font-black uppercase tracking-wide text-paco-accent">Juego móvil</p>
      <h1 class="mt-3 text-5xl font-black leading-none text-paco-card">¿Quién es este PACO?</h1>
      <p class="mt-4 text-xl font-bold text-paco-accent">Mira la cara. Elige el nombre. Sobrevive.</p>
      <p class="mt-5 text-base leading-7 text-paco-card/85">
        Cada ronda muestra una cara mock y cuatro nombres posibles. Acierta para mantener la racha;
        falla tres veces y termina la partida.
      </p>

      <div class="mt-7 grid gap-3 sm:grid-cols-3">
        <div class="rounded-md bg-paco-secondary p-4">
          <strong class="block text-2xl text-paco-accent">{{ gameConfig.initialLives }}</strong>
          <span class="text-sm font-bold text-paco-card">vidas iniciales</span>
        </div>
        <div class="rounded-md bg-paco-secondary p-4">
          <strong class="block text-2xl text-paco-accent">{{ gameConfig.optionCount }}</strong>
          <span class="text-sm font-bold text-paco-card">opciones por ronda</span>
        </div>
        <div class="rounded-md bg-paco-secondary p-4">
          <strong class="block text-2xl text-paco-accent">+1</strong>
          <span class="text-sm font-bold text-paco-card">vida cada 10 aciertos</span>
        </div>
      </div>

      <p class="mt-5 rounded-md border border-paco-accent/50 p-4 text-sm leading-6 text-paco-card/85">
        Aviso lúdico-científico: esto no reconoce personas reales ni deduce identidades. Solo juega con
        datos mock y nombres ficticios.
      </p>

      <PrimaryButton class="mt-7 w-full sm:w-auto" @click="router.push('/play')">Empezar partida</PrimaryButton>
    </section>
  </main>
</template>
