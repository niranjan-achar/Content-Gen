import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-white">
          ✨ ContentGen
        </Link>
        
        <nav className="flex gap-6 items-center">
          <Link to="/" className="text-white hover:text-purple-200 transition">
            Dashboard
          </Link>
          <Link to="/generate" className="text-white hover:text-purple-200 transition">
            Generate
          </Link>
          <Link to="/history" className="text-white hover:text-purple-200 transition">
            History
          </Link>
          <Link to="/reminders" className="text-white hover:text-purple-200 transition">
            Reminders
          </Link>
        </nav>
      </div>
    </header>
  )
}
