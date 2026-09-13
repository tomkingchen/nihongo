import { db, type SentenceEntry, type VocabEntry } from './schema'

interface ExportPayload {
  version: 1
  exportedAt: number
  vocab: VocabEntry[]
  sentences: SentenceEntry[]
}

export async function exportData(): Promise<void> {
  const [vocab, sentences] = await Promise.all([db.vocab.toArray(), db.sentences.toArray()])
  const payload: ExportPayload = { version: 1, exportedAt: Date.now(), vocab, sentences }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `nihongo-export-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export async function importData(file: File): Promise<{ vocabCount: number; sentenceCount: number }> {
  const text = await file.text()
  const parsed = JSON.parse(text) as Partial<ExportPayload>
  const vocab = Array.isArray(parsed.vocab) ? parsed.vocab : []
  const sentences = Array.isArray(parsed.sentences) ? parsed.sentences : []

  for (const entry of vocab) {
    const rest: Partial<VocabEntry> = { ...entry }
    delete rest.id
    await db.vocab.add(rest as VocabEntry)
  }
  for (const entry of sentences) {
    const rest: Partial<SentenceEntry> = { ...entry }
    delete rest.id
    await db.sentences.add(rest as SentenceEntry)
  }

  return { vocabCount: vocab.length, sentenceCount: sentences.length }
}
