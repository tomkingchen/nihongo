import { useEffect, useState, type ChangeEvent } from 'react'
import { exportData, importData } from '../../db/exportImport'
import {
  DEFAULT_VOICEVOX_BASE_URL,
  DEFAULT_VOICEVOX_SPEAKER_ID,
  getApiKey,
  getTtsEngine,
  getVoiceURI,
  getVoicevoxBaseUrl,
  getVoicevoxSpeakerId,
  setApiKey,
  setTtsEngine,
  setVoiceURI,
  setVoicevoxBaseUrl,
  setVoicevoxSpeakerId,
  type TtsEngine,
} from '../../lib/settings'
import { speakWithVoicevox } from '../../lib/tts'
import { fetchVoicevoxSpeakers, VoicevoxError, type VoicevoxSpeaker } from '../../lib/voicevox'

type TestState = { status: 'idle' } | { status: 'testing' } | { status: 'success' } | { status: 'error'; message: string }

export default function SettingsPage() {
  const [apiKeyInput, setApiKeyInput] = useState(() => getApiKey() ?? '')
  const [apiKeySaved, setApiKeySaved] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voiceURI, setVoiceURIState] = useState(() => getVoiceURI() ?? '')
  const [importMessage, setImportMessage] = useState<string | null>(null)
  const [importError, setImportError] = useState<string | null>(null)

  const [ttsEngine, setTtsEngineState] = useState<TtsEngine>(() => getTtsEngine())
  const [voicevoxBaseUrl, setVoicevoxBaseUrlState] = useState(() => getVoicevoxBaseUrl())
  const [voicevoxSpeakerId, setVoicevoxSpeakerIdState] = useState(() => getVoicevoxSpeakerId())
  const [voicevoxSpeakers, setVoicevoxSpeakers] = useState<VoicevoxSpeaker[]>([])
  const [voicevoxSpeakersError, setVoicevoxSpeakersError] = useState<string | null>(null)
  const [voicevoxTest, setVoicevoxTest] = useState<TestState>({ status: 'idle' })

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    function loadVoices() {
      setVoices(window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith('ja')))
    }
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
    return () => {
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [])

  useEffect(() => {
    if (ttsEngine !== 'voicevox') return
    let cancelled = false
    setVoicevoxSpeakersError(null)
    fetchVoicevoxSpeakers(voicevoxBaseUrl)
      .then((speakers) => {
        if (cancelled) return
        setVoicevoxSpeakers(speakers)
      })
      .catch((err) => {
        if (cancelled) return
        setVoicevoxSpeakers([])
        setVoicevoxSpeakersError(
          err instanceof VoicevoxError
            ? err.message
            : 'Failed to load speaker list. Using default speaker id.',
        )
      })
    return () => {
      cancelled = true
    }
  }, [ttsEngine, voicevoxBaseUrl])

  function handleEngineChange(engine: TtsEngine) {
    setTtsEngineState(engine)
    setTtsEngine(engine)
    setVoicevoxTest({ status: 'idle' })
  }

  function handleVoicevoxBaseUrlChange(url: string) {
    setVoicevoxBaseUrlState(url)
    setVoicevoxBaseUrl(url)
    setVoicevoxTest({ status: 'idle' })
  }

  function handleVoicevoxSpeakerChange(id: number) {
    setVoicevoxSpeakerIdState(id)
    setVoicevoxSpeakerId(id)
  }

  async function handleVoicevoxTest() {
    setVoicevoxTest({ status: 'testing' })
    try {
      await speakWithVoicevox('こんにちは', voicevoxBaseUrl || DEFAULT_VOICEVOX_BASE_URL, voicevoxSpeakerId)
      setVoicevoxTest({ status: 'success' })
    } catch (err) {
      setVoicevoxTest({
        status: 'error',
        message: err instanceof Error ? err.message : 'Failed to play test audio.',
      })
    }
  }

  function handleSaveApiKey() {
    setApiKey(apiKeyInput.trim())
    setApiKeySaved(true)
    setTimeout(() => setApiKeySaved(false), 2000)
  }

  function handleClearApiKey() {
    setApiKeyInput('')
    setApiKey('')
  }

  function handleVoiceChange(uri: string) {
    setVoiceURIState(uri)
    setVoiceURI(uri || null)
  }

  async function handleImport(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setImportMessage(null)
    setImportError(null)
    try {
      const { vocabCount, sentenceCount } = await importData(file)
      setImportMessage(`Imported ${vocabCount} vocab and ${sentenceCount} sentence entries.`)
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Failed to import file.')
    }
  }

  return (
    <div>
      <h1>Settings</h1>

      <section className="card">
        <h2>Anthropic API Key</h2>
        <p>
          This key is saved only in this browser's local storage and is sent directly to Anthropic's
          API — never anywhere else. This app is meant for single-user, personal use; don't deploy it
          somewhere with a shared key.
        </p>
        <div className="form-field">
          <label>API Key</label>
          <input
            type="password"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder="sk-ant-..."
            autoComplete="off"
          />
        </div>
        <button type="button" onClick={handleSaveApiKey}>
          Save
        </button>{' '}
        <button type="button" onClick={handleClearApiKey}>
          Clear
        </button>
        {apiKeySaved && <span> Saved.</span>}
      </section>

      <section className="card">
        <h2>Voice engine</h2>
        <div className="form-field">
          <label>
            <input
              type="radio"
              name="ttsEngine"
              checked={ttsEngine === 'browser'}
              onChange={() => handleEngineChange('browser')}
            />{' '}
            Browser (default)
          </label>
          <label>
            <input
              type="radio"
              name="ttsEngine"
              checked={ttsEngine === 'voicevox'}
              onChange={() => handleEngineChange('voicevox')}
            />{' '}
            VOICEVOX (local)
          </label>
        </div>

        {ttsEngine === 'browser' &&
          (voices.length === 0 ? (
            <p>No Japanese voices found in this browser. Play buttons will fall back to the system default.</p>
          ) : (
            <div className="form-field">
              <label>ja-JP voice</label>
              <select value={voiceURI} onChange={(e) => handleVoiceChange(e.target.value)}>
                <option value="">Default</option>
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          ))}

        {ttsEngine === 'voicevox' && (
          <>
            <p>
              Requires the VOICEVOX engine running locally — see the README's "Better audio with VOICEVOX"
              section for setup and the CORS flag needed for this page to reach it.
            </p>
            <div className="form-field">
              <label>Engine base URL</label>
              <input
                type="text"
                value={voicevoxBaseUrl}
                onChange={(e) => handleVoicevoxBaseUrlChange(e.target.value)}
                placeholder={DEFAULT_VOICEVOX_BASE_URL}
              />
            </div>
            <div className="form-field">
              <label>Speaker</label>
              {voicevoxSpeakers.length === 0 ? (
                <input
                  type="number"
                  value={voicevoxSpeakerId}
                  onChange={(e) => handleVoicevoxSpeakerChange(Number(e.target.value) || DEFAULT_VOICEVOX_SPEAKER_ID)}
                />
              ) : (
                <select
                  value={voicevoxSpeakerId}
                  onChange={(e) => handleVoicevoxSpeakerChange(Number(e.target.value))}
                >
                  {voicevoxSpeakers.flatMap((speaker) =>
                    speaker.styles.map((style) => (
                      <option key={style.id} value={style.id}>
                        {speaker.name} - {style.name}
                      </option>
                    )),
                  )}
                </select>
              )}
            </div>
            {voicevoxSpeakersError && (
              <p style={{ color: 'crimson' }}>
                {voicevoxSpeakersError} Falling back to speaker id {DEFAULT_VOICEVOX_SPEAKER_ID}.
              </p>
            )}
            <button type="button" onClick={() => void handleVoicevoxTest()} disabled={voicevoxTest.status === 'testing'}>
              {voicevoxTest.status === 'testing' ? 'Testing…' : 'Test'}
            </button>
            {voicevoxTest.status === 'success' && <span> ✓ Played successfully.</span>}
            {voicevoxTest.status === 'error' && (
              <p style={{ color: 'crimson' }}>{voicevoxTest.message}</p>
            )}
          </>
        )}
      </section>

      <section className="card">
        <h2>Data</h2>
        <p>
          <button type="button" onClick={() => exportData()}>
            Export JSON
          </button>
        </p>
        <div className="form-field">
          <label>Import JSON</label>
          <input type="file" accept="application/json" onChange={handleImport} />
        </div>
        {importMessage && <p>{importMessage}</p>}
        {importError && <p style={{ color: 'crimson' }}>{importError}</p>}
      </section>
    </div>
  )
}
