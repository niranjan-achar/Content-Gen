import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { user, signOut } = useAuth()

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

          {user ? (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/20">
              <div className="flex items-center gap-2">
                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata?.full_name || 'User'}
                    className="w-8 h-8 rounded-full border-2 border-cyan-400"
                  />
                )}
                <span className="text-white text-sm">
                  {user.user_metadata?.full_name || user.email}
                </span>
              </div>
              <button
                onClick={signOut}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-lg transition border border-red-400/50"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-4 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-white rounded-lg transition border border-cyan-400/50"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
