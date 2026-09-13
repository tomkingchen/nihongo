import Dexie, { type EntityTable } from 'dexie'

export interface VocabEntry {
  id: number
  written: string
  reading: string
  romaji: string
  english: string
  chinese: string
  tags?: string[]
  createdAt: number
  updatedAt: number
}

export interface SentenceEntry {
  id: number
  written: string
  reading: string
  english: string
  chinese: string
  tags?: string[]
  createdAt: number
  updatedAt: number
}

export const db = new Dexie('nihongo') as Dexie & {
  vocab: EntityTable<VocabEntry, 'id'>
  sentences: EntityTable<SentenceEntry, 'id'>
}

db.version(1).stores({
  vocab: '++id, written, reading, *tags, createdAt',
  sentences: '++id, written, reading, *tags, createdAt',
})
