import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { countVocab } from '../../db/vocab'
import { countSentences } from '../../db/sentences'

export default function DashboardPage() {
  const [vocabCount, setVocabCount] = useState<number | null>(null)
  const [sentenceCount, setSentenceCount] = useState<number | null>(null)

  useEffect(() => {
    countVocab().then(setVocabCount)
    countSentences().then(setSentenceCount)
  }, [])

  return (
    <div>
      <h1>Nihongo</h1>
      <div className="card">
        <p>
          <strong>{vocabCount ?? '…'}</strong> vocab entries
        </p>
        <p>
          <strong>{sentenceCount ?? '…'}</strong> sentence entries
        </p>
      </div>
      <div className="grid-links">
        <Link className="big-link" to="/vocab/add">
          + Add Vocab
        </Link>
        <Link className="big-link" to="/sentences/add">
          + Add Sentence
        </Link>
        <Link className="big-link" to="/review">
          ▶ Review
        </Link>
      </div>
    </div>
  )
}
