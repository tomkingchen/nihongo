import { Route, Routes } from 'react-router'
import DashboardPage from './features/dashboard/DashboardPage'
import AddVocabPage from './features/vocab/AddVocabPage'
import VocabListPage from './features/vocab/VocabListPage'
import AddSentencePage from './features/sentences/AddSentencePage'
import SentenceListPage from './features/sentences/SentenceListPage'
import ReviewPage from './features/review/ReviewPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/vocab" element={<VocabListPage />} />
      <Route path="/vocab/add" element={<AddVocabPage />} />
      <Route path="/sentences" element={<SentenceListPage />} />
      <Route path="/sentences/add" element={<AddSentencePage />} />
      <Route path="/review" element={<ReviewPage />} />
    </Routes>
  )
}
