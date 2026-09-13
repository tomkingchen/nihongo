import { getTtsEngine, getVoiceURI, getVoicevoxBaseUrl, getVoicevoxSpeakerId } from './settings'
import { synthesizeVoicevox, VoicevoxError } from './voicevox'

export class TtsError extends Error {}

function pickJapaneseVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  const preferredURI = getVoiceURI()
  if (preferredURI) {
    const preferred = voices.find((v) => v.voiceURI === preferredURI)
    if (preferred) return preferred
  }
  return voices.find((v) => v.lang === 'ja-JP') ?? voices.find((v) => v.lang.startsWith('ja')) ?? null
}

function speakBrowser(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ja-JP'
  const voice = pickJapaneseVoice()
  if (voice) utterance.voice = voice
  window.speechSynthesis.speak(utterance)
}

let currentVoicevoxAudio: HTMLAudioElement | null = null

export async function speakWithVoicevox(text: string, baseUrl: string, speakerId: number): Promise<void> {
  const blob = await synthesizeVoicevox(text, baseUrl, speakerId)
  const url = URL.createObjectURL(blob)
  if (currentVoicevoxAudio) {
    currentVoicevoxAudio.pause()
    URL.revokeObjectURL(currentVoicevoxAudio.src)
  }
  const audio = new Audio(url)
  currentVoicevoxAudio = audio
  audio.addEventListener('ended', () => URL.revokeObjectURL(url))
  await audio.play()
}

/**
 * Plays pronunciation of `text` using the configured engine. Throws `TtsError` with a
 * human-readable message on failure (VOICEVOX engine unreachable, CORS blocked, etc.) — callers
 * must surface this rather than silently falling back to the browser voice.
 */
export async function speak(text: string): Promise<void> {
  if (!text || typeof window === 'undefined') return

  if (getTtsEngine() === 'voicevox') {
    try {
      await speakWithVoicevox(text, getVoicevoxBaseUrl(), getVoicevoxSpeakerId())
    } catch (err) {
      if (err instanceof VoicevoxError) throw new TtsError(err.message)
      throw new TtsError('Unexpected error playing audio via VOICEVOX.')
    }
    return
  }

  speakBrowser(text)
}
