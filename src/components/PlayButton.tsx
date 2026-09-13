import { useState } from 'react'
import { speak } from '../lib/tts'

export function PlayButton({ text }: { text: string }) {
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setError(null)
    try {
      await speak(text)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to play audio.')
    }
  }

  return (
    <>
      <button
        type="button"
        className="icon"
        aria-label={`Play pronunciation of ${text}`}
        onClick={(e) => {
          e.stopPropagation()
          void handleClick()
        }}
      >
        🔊
      </button>
      {error && (
        <span role="alert" style={{ color: 'crimson', fontSize: '0.85em' }}>
          {' '}
          {error}
        </span>
      )}
    </>
  )
}
