export function useSeededRandom(seed = Date.now()) {
  let state = seed >>> 0

  const next = () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 0x100000000
  }

  const integer = (maxExclusive: number) => Math.floor(next() * maxExclusive)

  const shuffle = <T>(items: T[]) => {
    const copy = [...items]
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = integer(index + 1)
      ;[copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]]
    }
    return copy
  }

  const pick = <T>(items: T[]) => items[integer(items.length)]

  return {
    next,
    integer,
    shuffle,
    pick,
  }
}
