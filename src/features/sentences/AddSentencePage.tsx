import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { TextField } from '../../components/TextField'
import { addSentence } from '../../db/sentences'

export default function AddSentencePage() {
  const navigate = useNavigate()
  const [written, setWritten] = useState('')
  const [reading, setReading] = useState('')
  const [english, setEnglish] = useState('')
  const [chinese, setChinese] = useState('')
  const [tags, setTags] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!written.trim() || !reading.trim()) return
    setSaving(true)
    await addSentence({
      written: written.trim(),
      reading: reading.trim(),
      english: english.trim(),
      chinese: chinese.trim(),
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    })
    navigate('/sentences')
  }

  return (
    <div>
      <h1>Add Sentence</h1>
      <form className="card" onSubmit={handleSubmit}>
        <TextField
          label="Written"
          value={written}
          onChange={setWritten}
          required
          textarea
          placeholder="ええと、私たちのオフィスは広くないです"
        />
        <TextField label="Reading (hiragana)" value={reading} onChange={setReading} required textarea />
        <TextField label="English" value={english} onChange={setEnglish} textarea />
        <TextField label="Chinese" value={chinese} onChange={setChinese} textarea />
        <TextField label="Tags (comma separated)" value={tags} onChange={setTags} placeholder="n3, work" />
        <button type="submit" disabled={saving}>
          Save
        </button>
      </form>
    </div>
  )
}
