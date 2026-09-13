import { useEffect, useMemo, useState } from 'react'
import { PlayButton } from '../../components/PlayButton'
import { deleteVocab, listVocab, updateVocab, type VocabInput } from '../../db/vocab'
import type { VocabEntry } from '../../db/schema'

type EditState = VocabInput & { tagsText: string }

function toEditState(entry: VocabEntry): EditState {
  return {
    written: entry.written,
    reading: entry.reading,
    romaji: entry.romaji,
    english: entry.english,
    chinese: entry.chinese,
    tags: entry.tags,
    tagsText: (entry.tags ?? []).join(', '),
  }
}

export default function VocabListPage() {
  const [entries, setEntries] = useState<VocabEntry[]>([])
  const [query, setQuery] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editState, setEditState] = useState<EditState | null>(null)

  async function refresh() {
    setEntries(await listVocab())
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

  function startEdit(entry: VocabEntry) {
    setEditingId(entry.id)
    setEditState(toEditState(entry))
  }

  function cancelEdit() {
    setEditingId(null)
    setEditState(null)
  }

  async function saveEdit(id: number) {
    if (!editState) return
    await updateVocab(id, {
      written: editState.written.trim(),
      reading: editState.reading.trim(),
      romaji: editState.romaji.trim(),
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
    if (!confirm('Delete this vocab entry?')) return
    await deleteVocab(id)
    await refresh()
  }

  return (
    <div>
      <h1>Vocab</h1>
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
        <p className="empty-state">No vocab entries yet.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Written</th>
                <th>Reading</th>
                <th>Romaji</th>
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
                        <input value={editState.written} onChange={(e) => setEditState({ ...editState, written: e.target.value })} />
                      </td>
                      <td>
                        <input value={editState.reading} onChange={(e) => setEditState({ ...editState, reading: e.target.value })} />
                      </td>
                      <td>
                        <input value={editState.romaji} onChange={(e) => setEditState({ ...editState, romaji: e.target.value })} />
                      </td>
                      <td>
                        <input value={editState.english} onChange={(e) => setEditState({ ...editState, english: e.target.value })} />
                      </td>
                      <td>
                        <input value={editState.chinese} onChange={(e) => setEditState({ ...editState, chinese: e.target.value })} />
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
                    <td>{entry.romaji}</td>
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
