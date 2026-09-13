export type Deck = 'vocab' | 'sentences' | 'both'

export interface ReviewCard {
  id: string
  kind: 'vocab' | 'sentence'
  written: string
  reading: string
  romaji?: string
  english: string
  chinese: string
}
