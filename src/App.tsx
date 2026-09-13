import { NavLink } from 'react-router'
import AppRoutes from './routes'

export default function App() {
  return (
    <>
      <nav className="nav">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/vocab">Vocab</NavLink>
        <NavLink to="/vocab/add">Add Vocab</NavLink>
        <NavLink to="/sentences">Sentences</NavLink>
        <NavLink to="/sentences/add">Add Sentence</NavLink>
        <NavLink to="/review">Review</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </nav>
      <div className="container">
        <AppRoutes />
      </div>
    </>
  )
}
