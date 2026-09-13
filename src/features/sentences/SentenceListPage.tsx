import { useEffect, useMemo, useState } from 'react'
import { PlayButton } from '../../components/PlayButton'
import { deleteSentence, listSentences, updateSentence, type SentenceInput } from '../../db/sentences'
import type { SentenceEntry } from '../../db/schema'

type EditState = SentenceInput & { tagsText: string }

function toEditState(entry: SentenceEntry): EditState {
  return {
    written: entry.written,
    reading: entry.reading,
    english: entry.english,
    chinese: entry.chinese,
    tags: entry.tags,
    tagsText: (entry.tags ?? []).join(', '),
  }
}

export default function SentenceListPage() {
  const [entries, setEntries] = useState<SentenceEntry[]>([])
  const [query, setQuery] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editState, setEditState] = useState<EditState | null>(null)

  async function refresh() {
    setEntries(await listSentences())
  }

  useEffect(() => {
    refresh()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return entries
    return entries.filter(
      (e) =>
        e.written.toLowerCase().includes(q) ||
        (e.tags ?? []).some((t) => t.toLowerCase().includes(q)),
    )
  }, [entries, query])

  function startEdit(entry: SentenceEntry) {
    setEditingId(entry.id)
    setEditState(toEditState(entry))
  }

  function cancelEdit() {
    setEditingId(null)
    setEditState(null)
  }

  async function saveEdit(id: number) {
    if (!editState) return
    await updateSentence(id, {
      written: editState.written.trim(),
      reading: editState.reading.trim(),
      english: editState.english.trim(),
      chinese: editState.chinese.trim(),
      tags: editState.tagsText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    })
    cancelEdit()
    await refresh()
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this sentence entry?')) return
    await deleteSentence(id)
    await refresh()
  }

  return (
    <div>
      <h1>Sentences</h1>
      <div className="toolbar">
        <input
          type="text"
          placeholder="Search by written form or tag…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: '0.5rem 0.6rem', borderRadius: 6, border: '1px solid #c9c9d4' }}
        />
      </div>
      {filtered.length === 0 ? (
        <p className="empty-state">No sentence entries yet.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Written</th>
                <th>Reading</th>
                <th>English</th>
                <th>Chinese</th>
                <th>Tags</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => {
                const isEditing = editingId === entry.id
                if (isEditing && editState) {
                  return (
                    <tr key={entry.id}>
                      <td>
                        <textarea
                          value={editState.written}
                          onChange={(e) => setEditState({ ...editState, written: e.target.value })}
                        />
                      </td>
                      <td>
                        <textarea
                          value={editState.reading}
                          onChange={(e) => setEditState({ ...editState, reading: e.target.value })}
                        />
                      </td>
                      <td>
                        <textarea
                          value={editState.english}
                          onChange={(e) => setEditState({ ...editState, english: e.target.value })}
                        />
                      </td>
                      <td>
                        <textarea
                          value={editState.chinese}
                          onChange={(e) => setEditState({ ...editState, chinese: e.target.value })}
                        />
                      </td>
                      <td>
                        <input value={editState.tagsText} onChange={(e) => setEditState({ ...editState, tagsText: e.target.value })} />
                      </td>
                      <td>
                        <button onClick={() => saveEdit(entry.id)}>Save</button>{' '}
                        <button className="secondary" onClick={cancelEdit}>
                          Cancel
                        </button>
                      </td>
                    </tr>
                  )
                }
                return (
                  <tr key={entry.id}>
                    <td>
                      <PlayButton text={entry.written} /> {entry.written}
                    </td>
                    <td>{entry.reading}</td>
                    <td>{entry.english}</td>
                    <td>{entry.chinese}</td>
                    <td>
                      {(entry.tags ?? []).map((t) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ))}
                    </td>
                    <td>
                      <button className="secondary" onClick={() => startEdit(entry)}>
                        Edit
                      </button>{' '}
                      <button className="danger" onClick={() => handleDelete(entry.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
