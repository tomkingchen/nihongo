import { PlayButton } from '../../components/PlayButton'
import type { ReviewCard } from './types'

interface FlashcardProps {
  card: ReviewCard
  revealed: boolean
  onToggle: () => void
}

export function Flashcard({ card, revealed, onToggle }: FlashcardProps) {
  return (
    <div className="flashcard" onClick={onToggle} role="button" tabIndex={0}>
      <div className="written">
        {card.written} <PlayButton text={card.written} />
      </div>
      {revealed ? (
        <div className="answer-block">
          <div>{card.reading}</div>
          {card.romaji ? <div>{card.romaji}</div> : null}
          <div>{card.english}</div>
          <div>{card.chinese}</div>
        </div>
      ) : (
        <button type="button" onClick={(e) => { e.stopPropagation(); onToggle() }}>
          Show answer
        </button>
      )}
    </div>
  )
}
