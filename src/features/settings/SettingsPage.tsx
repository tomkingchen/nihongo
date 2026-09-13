import { useEffect, useState, type ChangeEvent } from 'react'
import { exportData, importData } from '../../db/exportImport'
import { getApiKey, getVoiceURI, setApiKey, setVoiceURI } from '../../lib/settings'

export default function SettingsPage() {
  const [apiKeyInput, setApiKeyInput] = useState(() => getApiKey() ?? '')
  const [apiKeySaved, setApiKeySaved] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voiceURI, setVoiceURIState] = useState(() => getVoiceURI() ?? '')
  const [importMessage, setImportMessage] = useState<string | null>(null)
  const [importError, setImportError] = useState<string | null>(null)

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
        <h2>Voice</h2>
        {voices.length === 0 ? (
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
