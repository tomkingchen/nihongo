import type { Deck } from './types'

interface DeckPickerProps {
  deck: Deck
  onDeckChange: (deck: Deck) => void
  shuffle: boolean
  onShuffleChange: (shuffle: boolean) => void
}

export function DeckPicker({ deck, onDeckChange, shuffle, onShuffleChange }: DeckPickerProps) {
  return (
    <div className="toolbar">
      <label>
        Deck:{' '}
        <select value={deck} onChange={(e) => onDeckChange(e.target.value as Deck)}>
          <option value="vocab">Vocab only</option>
          <option value="sentences">Sentences only</option>
          <option value="both">Both</option>
        </select>
      </label>
      <label>
        <input type="checkbox" checked={shuffle} onChange={(e) => onShuffleChange(e.target.checked)} /> Shuffle
      </label>
    </div>
  )
}
