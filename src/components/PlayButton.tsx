import { speak } from '../lib/tts'

export function PlayButton({ text }: { text: string }) {
  return (
    <button
      type="button"
      className="icon"
      aria-label={`Play pronunciation of ${text}`}
      onClick={(e) => {
        e.stopPropagation()
        speak(text)
      }}
    >
      🔊
    </button>
  )
}
