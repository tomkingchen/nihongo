import { useEffect, useMemo, useState } from 'react'
import { listVocab } from '../../db/vocab'
import { listSentences } from '../../db/sentences'
import { DeckPicker } from './DeckPicker'
import { Flashcard } from './Flashcard'
import type { Deck, ReviewCard } from './types'

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function ReviewPage() {
  const [deck, setDeck] = useState<Deck>('both')
  const [shuffle, setShuffle] = useState(false)
  const [allCards, setAllCards] = useState<ReviewCard[]>([])
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    async function load() {
      const [vocab, sentences] = await Promise.all([listVocab(), listSentences()])
      const vocabCards: ReviewCard[] = vocab.map((v) => ({
        id: `vocab-${v.id}`,
        kind: 'vocab',
        written: v.written,
        reading: v.reading,
        romaji: v.romaji,
        english: v.english,
        chinese: v.chinese,
      }))
      const sentenceCards: ReviewCard[] = sentences.map((s) => ({
        id: `sentence-${s.id}`,
        kind: 'sentence',
        written: s.written,
        reading: s.reading,
        english: s.english,
        chinese: s.chinese,
      }))
      setAllCards([...vocabCards, ...sentenceCards])
    }
    load()
  }, [])

  const deckCards = useMemo(() => {
    let cards = allCards
    if (deck === 'vocab') cards = allCards.filter((c) => c.kind === 'vocab')
    else if (deck === 'sentences') cards = allCards.filter((c) => c.kind === 'sentence')
    return shuffle ? shuffleArray(cards) : cards
  }, [allCards, deck, shuffle])

  useEffect(() => {
    setIndex(0)
    setRevealed(false)
  }, [deck, shuffle, allCards])

  const card = deckCards[index]

  function goNext() {
    setRevealed(false)
    setIndex((i) => Math.min(i + 1, deckCards.length - 1))
  }

  function goPrev() {
    setRevealed(false)
    setIndex((i) => Math.max(i - 1, 0))
  }

  return (
    <div>
      <h1>Review</h1>
      <DeckPicker deck={deck} onDeckChange={setDeck} shuffle={shuffle} onShuffleChange={setShuffle} />
      {deckCards.length === 0 ? (
        <p className="empty-state">No cards in this deck yet.</p>
      ) : (
        <>
          <Flashcard card={card} revealed={revealed} onToggle={() => setRevealed((r) => !r)} />
          <div className="review-controls">
            <button className="secondary" onClick={goPrev} disabled={index === 0}>
              ← Prev
            </button>
            <span className="progress">
              {index + 1} / {deckCards.length}
            </span>
            <button className="secondary" onClick={goNext} disabled={index === deckCards.length - 1}>
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  )
}
