import { computed, ref } from 'vue'

import type { FaceEntry } from '@/types/game'

type NameMap = Record<string, string[]>

const faces = ref<FaceEntry[]>([])
const nameMap = ref<NameMap>({})
const isLoading = ref(false)
const error = ref<string | null>(null)

export function useDataset() {
  const loadDataset = async () => {
    if (faces.value.length > 0 || isLoading.value) {
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const baseUrl = import.meta.env.BASE_URL
      const [facesResponse, namesResponse] = await Promise.all([
        fetch(`${baseUrl}data/faces.json`),
        fetch(`${baseUrl}data/name-map.json`),
      ])

      if (!facesResponse.ok || !namesResponse.ok) {
        throw new Error('No se pudo cargar el dataset')
      }

      faces.value = await facesResponse.json()
      nameMap.value = await namesResponse.json()
    } catch (caughtError) {
      error.value = caughtError instanceof Error ? caughtError.message : 'Error desconocido'
    } finally {
      isLoading.value = false
    }
  }

  const names = computed(() => Array.from(new Set(faces.value.map((face) => face.name))))

  const resolveImageUrl = (face: FaceEntry) => `${import.meta.env.BASE_URL}${face.image}`

  return {
    faces,
    nameMap,
    names,
    isLoading,
    error,
    loadDataset,
    resolveImageUrl,
  }
}
