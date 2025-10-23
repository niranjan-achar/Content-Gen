import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import SignIn from './pages/SignIn'
import Dashboard from './pages/Dashboard'
import Generator from './pages/Generator'
import History from './pages/History'
import Reminders from './pages/Reminders'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/generate" element={<Generator />} />
          <Route path="/history" element={<History />} />
          <Route path="/reminders" element={<Reminders />} />
        </Routes>
      </main>
    </div>
  )
}
