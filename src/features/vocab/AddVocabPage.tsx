import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { TextField } from '../../components/TextField'
import { addVocab } from '../../db/vocab'

export default function AddVocabPage() {
  const navigate = useNavigate()
  const [written, setWritten] = useState('')
  const [reading, setReading] = useState('')
  const [romaji, setRomaji] = useState('')
  const [english, setEnglish] = useState('')
  const [chinese, setChinese] = useState('')
  const [tags, setTags] = useState('')
  const [saving, setSaving] = useState(false)

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
