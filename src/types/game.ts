export interface FaceEntry {
  id: string
  originalName: string
  spanishName: string
  gender: string
  image: string
  source?: string
}

export interface GameQuestion {
  face: FaceEntry
  options: string[]
  correctName: string
  questionNumber: number
}

export type GameStatus = 'ready' | 'playing' | 'feedback' | 'finished'

export interface GameState {
  lives: number
  score: number
  streak: number
  bestStreak: number
  earnedLives: number
  questionNumber: number
  status: GameStatus
  selectedName: string | null
  isCorrect: boolean | null
  currentQuestion: GameQuestion | null
}

export interface GameResult {
  score: number
  bestStreak: number
  earnedLives: number
  questionsPlayed: number
  finishedAt: string
}
