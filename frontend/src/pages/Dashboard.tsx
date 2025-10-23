import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface Stats {
  totalGenerations: number
  blogCount: number
  captionCount: number
  tweetCount: number
  mostUsed: string
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalGenerations: 0,
    blogCount: 0,
    captionCount: 0,
    tweetCount: 0,
    mostUsed: '-'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/history/`)
      const history = await response.json()
      
      // Calculate stats from history
      const blogCount = history.filter((h: any) => h.type === 'blog').length
      const captionCount = history.filter((h: any) => h.type === 'caption').length
      const tweetCount = history.filter((h: any) => h.type === 'tweet').length
      const totalGenerations = history.length
      
      // Find most used type
      let mostUsed = '-'
      if (totalGenerations > 0) {
        const counts = { blog: blogCount, caption: captionCount, tweet: tweetCount }
        mostUsed = Object.keys(counts).reduce((a, b) => counts[a as keyof typeof counts] > counts[b as keyof typeof counts] ? a : b)
      }
      
      setStats({
        totalGenerations,
        blogCount,
        captionCount,
        tweetCount,
        mostUsed
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="text-white/70 text-sm mb-2">Total Generations</div>
          <div className="text-4xl font-bold text-white">
            {loading ? '...' : stats.totalGenerations}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="text-white/70 text-sm mb-2">Blog Posts</div>
          <div className="text-4xl font-bold text-white">
            {loading ? '...' : stats.blogCount}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="text-white/70 text-sm mb-2">Captions</div>
          <div className="text-4xl font-bold text-white">
            {loading ? '...' : stats.captionCount}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="text-white/70 text-sm mb-2">Tweets</div>
          <div className="text-4xl font-bold text-white">
            {loading ? '...' : stats.tweetCount}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/generate" 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg hover:shadow-lg transition text-center"
          >
            🚀 Generate Content
          </Link>
          <Link 
            to="/history" 
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold py-4 px-6 rounded-lg hover:shadow-lg transition text-center"
          >
            📜 View History
          </Link>
          <Link 
            to="/reminders" 
            className="bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold py-4 px-6 rounded-lg hover:shadow-lg transition text-center"
          >
            ⏰ Manage Reminders
          </Link>
        </div>
      </div>

      {/* Most Used Type */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-2">Most Used Type</h3>
        <p className="text-white/80 text-lg capitalize">{stats.mostUsed}</p>
      </div>
    </div>
  )
}
