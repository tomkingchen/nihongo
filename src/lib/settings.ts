const API_KEY_STORAGE_KEY = 'nihongo.anthropicApiKey'
const VOICE_URI_STORAGE_KEY = 'nihongo.ttsVoiceURI'
const TTS_ENGINE_STORAGE_KEY = 'nihongo.ttsEngine'
const VOICEVOX_BASE_URL_STORAGE_KEY = 'nihongo.voicevoxBaseUrl'
const VOICEVOX_SPEAKER_ID_STORAGE_KEY = 'nihongo.voicevoxSpeakerId'

export type TtsEngine = 'browser' | 'voicevox'

export const DEFAULT_VOICEVOX_BASE_URL = 'http://127.0.0.1:50021'
export const DEFAULT_VOICEVOX_SPEAKER_ID = 1

export function getApiKey(): string | null {
  return localStorage.getItem(API_KEY_STORAGE_KEY)
}

export function setApiKey(key: string) {
  if (key) localStorage.setItem(API_KEY_STORAGE_KEY, key)
  else localStorage.removeItem(API_KEY_STORAGE_KEY)
}

export function getVoiceURI(): string | null {
  return localStorage.getItem(VOICE_URI_STORAGE_KEY)
}

export function setVoiceURI(uri: string | null) {
  if (uri) localStorage.setItem(VOICE_URI_STORAGE_KEY, uri)
  else localStorage.removeItem(VOICE_URI_STORAGE_KEY)
}

export function getTtsEngine(): TtsEngine {
  return localStorage.getItem(TTS_ENGINE_STORAGE_KEY) === 'voicevox' ? 'voicevox' : 'browser'
}

export function setTtsEngine(engine: TtsEngine) {
  localStorage.setItem(TTS_ENGINE_STORAGE_KEY, engine)
}

export function getVoicevoxBaseUrl(): string {
  return localStorage.getItem(VOICEVOX_BASE_URL_STORAGE_KEY) || DEFAULT_VOICEVOX_BASE_URL
}

export function setVoicevoxBaseUrl(url: string) {
  if (url) localStorage.setItem(VOICEVOX_BASE_URL_STORAGE_KEY, url)
  else localStorage.removeItem(VOICEVOX_BASE_URL_STORAGE_KEY)
}

export function getVoicevoxSpeakerId(): number {
  const raw = localStorage.getItem(VOICEVOX_SPEAKER_ID_STORAGE_KEY)
  const parsed = raw ? Number(raw) : NaN
  return Number.isFinite(parsed) ? parsed : DEFAULT_VOICEVOX_SPEAKER_ID
}

export function setVoicevoxSpeakerId(id: number) {
  localStorage.setItem(VOICEVOX_SPEAKER_ID_STORAGE_KEY, String(id))
}
