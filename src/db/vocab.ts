import { db, type VocabEntry } from './schema'

export type VocabInput = Omit<VocabEntry, 'id' | 'createdAt' | 'updatedAt'>

export function listVocab() {
  return db.vocab.orderBy('createdAt').reverse().toArray()
}

export function countVocab() {
  return db.vocab.count()
}

export async function addVocab(input: VocabInput) {
  const now = Date.now()
  return db.vocab.add({ ...input, createdAt: now, updatedAt: now } as VocabEntry)
}

export async function updateVocab(id: number, input: Partial<VocabInput>) {
  return db.vocab.update(id, { ...input, updatedAt: Date.now() })
}

export function deleteVocab(id: number) {
  return db.vocab.delete(id)
}
