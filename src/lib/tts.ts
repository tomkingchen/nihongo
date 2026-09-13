let cachedJaVoice: SpeechSynthesisVoice | null | undefined

function pickJapaneseVoice(): SpeechSynthesisVoice | null {
  if (cachedJaVoice !== undefined) return cachedJaVoice
  const voices = window.speechSynthesis.getVoices()
  cachedJaVoice = voices.find((v) => v.lang === 'ja-JP') ?? voices.find((v) => v.lang.startsWith('ja')) ?? null
  return cachedJaVoice
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedJaVoice = undefined
  }
}

export function speak(text: string) {
  if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ja-JP'
  const voice = pickJapaneseVoice()
  if (voice) utterance.voice = voice
  window.speechSynthesis.speak(utterance)
}
