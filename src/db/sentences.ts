import { db, type SentenceEntry } from './schema'

export type SentenceInput = Omit<SentenceEntry, 'id' | 'createdAt' | 'updatedAt'>

export function listSentences() {
  return db.sentences.orderBy('createdAt').reverse().toArray()
}

export function countSentences() {
  return db.sentences.count()
}

export async function addSentence(input: SentenceInput) {
  const now = Date.now()
  return db.sentences.add({ ...input, createdAt: now, updatedAt: now } as SentenceEntry)
}

export async function updateSentence(id: number, input: Partial<SentenceInput>) {
  return db.sentences.update(id, { ...input, updatedAt: Date.now() })
}

export function deleteSentence(id: number) {
  return db.sentences.delete(id)
}
