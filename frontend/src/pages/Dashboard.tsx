import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface Stats {
  totalGenerations: number
  blogCount: number
  captionCount: number
  tweetCount: number
  mostUsed: string
}

export default function Dashboard() {
  const { user, session } = useAuth()
  const [stats, setStats] = useState<Stats>({
    totalGenerations: 0,
    blogCount: 0,
    captionCount: 0,
    tweetCount: 0,
    mostUsed: '-'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchStats()
    }
  }, [user])

  const fetchStats = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      
      // Fetch user stats from users table (includes generation counts)
      const headers: Record<string, string> = {}
      if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`
      const userResponse = await fetch(`${apiUrl}/users/${user?.id}`, { headers })
      if (userResponse.ok) {
        const userData = await userResponse.json()
        const blogCount = userData.blogs_generated || 0
        const captionCount = userData.captions_generated || 0
        const tweetCount = userData.tweets_generated || 0
        const totalGenerations = userData.total_generated || 0

        // Find most used type
        let mostUsed = '-'
        if (totalGenerations > 0) {
          const counts = { blog: blogCount, caption: captionCount, tweet: tweetCount }
          mostUsed = Object.keys(counts).reduce((a, b) =>
            counts[a as keyof typeof counts] > counts[b as keyof typeof counts] ? a : b
          )
        }

        setStats({
          totalGenerations,
          blogCount,
          captionCount,
          tweetCount,
          mostUsed
        })
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-12">
        ✨ Dashboard
      </h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/30 hover:border-cyan-400/50 transition-all shadow-lg hover:shadow-cyan-500/20">
          <div className="text-cyan-400 text-sm font-semibold mb-2 uppercase tracking-wider">Total Generations</div>
          <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            {loading ? '...' : stats.totalGenerations}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all shadow-lg hover:shadow-blue-500/20">
          <div className="text-blue-400 text-sm font-semibold mb-2 uppercase tracking-wider">📝 Blog Posts</div>
          <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            {loading ? '...' : stats.blogCount}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all shadow-lg hover:shadow-purple-500/20">
          <div className="text-purple-400 text-sm font-semibold mb-2 uppercase tracking-wider">💬 Captions</div>
          <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {loading ? '...' : stats.captionCount}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-md rounded-2xl p-6 border border-emerald-500/30 hover:border-emerald-400/50 transition-all shadow-lg hover:shadow-emerald-500/20">
          <div className="text-emerald-400 text-sm font-semibold mb-2 uppercase tracking-wider">🐦 Tweets</div>
          <div className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            {loading ? '...' : stats.tweetCount}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 mb-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="text-4xl">⚡</span>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            to="/generate" 
            className="group bg-gradient-to-br from-cyan-600 to-blue-700 text-white font-bold py-6 px-8 rounded-2xl hover:shadow-2xl hover:shadow-cyan-500/30 transition-all hover:scale-105 text-center border border-cyan-400/20"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🚀</div>
            <div className="text-lg">Generate Content</div>
          </Link>
          <Link 
            to="/history" 
            className="group bg-gradient-to-br from-purple-600 to-indigo-700 text-white font-bold py-6 px-8 rounded-2xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all hover:scale-105 text-center border border-purple-400/20"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">📜</div>
            <div className="text-lg">View History</div>
          </Link>
          <Link 
            to="/reminders" 
            className="group bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-bold py-6 px-8 rounded-2xl hover:shadow-2xl hover:shadow-emerald-500/30 transition-all hover:scale-105 text-center border border-emerald-400/20"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">⏰</div>
            <div className="text-lg">Manage Reminders</div>
          </Link>
        </div>
      </div>

      {/* Most Used Type */}
      <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-xl">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="text-3xl">🏆</span>
          Most Used Type
        </h3>
        <p className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent capitalize">
          {stats.mostUsed}
        </p>
      </div>
    </div>
  )
}
