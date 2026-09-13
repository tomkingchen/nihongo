import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router'
import { TextField } from '../../components/TextField'
import { addVocab } from '../../db/vocab'
import { AiLookupError, lookupJapanese } from '../../lib/aiLookup'
import { getApiKey } from '../../lib/settings'

export default function AddVocabPage() {
  const navigate = useNavigate()
  const [written, setWritten] = useState('')
  const [reading, setReading] = useState('')
  const [romaji, setRomaji] = useState('')
  const [english, setEnglish] = useState('')
  const [chinese, setChinese] = useState('')
  const [tags, setTags] = useState('')
  const [saving, setSaving] = useState(false)
  const [suggesting, setSuggesting] = useState(false)
  const [suggestError, setSuggestError] = useState<string | null>(null)
  const hasApiKey = !!getApiKey()

  async function handleSuggest() {
    if (!written.trim()) return
    setSuggesting(true)
    setSuggestError(null)
    try {
      const result = await lookupJapanese(written.trim(), 'vocab')
      setReading(result.reading)
      setRomaji(result.romaji ?? '')
      setEnglish(result.english)
      setChinese(result.chinese)
    } catch (err) {
      setSuggestError(err instanceof AiLookupError ? err.message : 'Suggestion failed. Fill in fields manually.')
    } finally {
      setSuggesting(false)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!written.trim() || !reading.trim()) return
    setSaving(true)
    await addVocab({
      written: written.trim(),
      reading: reading.trim(),
      romaji: romaji.trim(),
      english: english.trim(),
      chinese: chinese.trim(),
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    })
    navigate('/vocab')
  }

  return (
    <div>
      <h1>Add Vocab</h1>
      <form className="card" onSubmit={handleSubmit}>
        <TextField label="Written" value={written} onChange={setWritten} required placeholder="立派" />
        {hasApiKey ? (
          <p>
            <button type="button" onClick={handleSuggest} disabled={suggesting || !written.trim()}>
              {suggesting ? 'Suggesting…' : 'Suggest'}
            </button>
          </p>
        ) : (
          <p>
            <Link to="/settings">Add an API key in Settings</Link> to enable AI-assisted suggestions.
          </p>
        )}
        {suggestError && <p style={{ color: 'crimson' }}>{suggestError}</p>}
        <TextField label="Reading (hiragana)" value={reading} onChange={setReading} required placeholder="りっぱ" />
        <TextField label="Romaji" value={romaji} onChange={setRomaji} placeholder="rippa" />
        <TextField label="English" value={english} onChange={setEnglish} placeholder="splendid" />
        <TextField label="Chinese" value={chinese} onChange={setChinese} placeholder="漂亮" />
        <TextField label="Tags (comma separated)" value={tags} onChange={setTags} placeholder="adjective, n2" />
        <button type="submit" disabled={saving}>
          Save
        </button>
      </form>
    </div>
  )
}
