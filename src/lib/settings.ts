const API_KEY_STORAGE_KEY = 'nihongo.anthropicApiKey'
const VOICE_URI_STORAGE_KEY = 'nihongo.ttsVoiceURI'

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
