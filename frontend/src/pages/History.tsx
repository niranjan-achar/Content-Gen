import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type ContentType = 'blog' | 'caption' | 'tweet'

interface HistoryItem {
  id: string
  type: ContentType
  input_text: string
  generated_text: string
  created_at: string
}

export default function History() {
  const { session } = useAuth()
  const [filter, setFilter] = useState<ContentType | 'all'>('all')
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetchHistory()
  }, [filter])

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const url = filter === 'all' 
        ? `${apiUrl}/history/`
        : `${apiUrl}/history/?type=${filter}`
      
      const headers: Record<string, string> = {}
      if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`
      const response = await fetch(url, { headers })
      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.error('Failed to fetch history:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const headers: Record<string, string> = {}
      if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`
      const response = await fetch(`${apiUrl}/history/${id}/`, {
        method: 'DELETE',
        headers
      })
      
      if (response.ok) {
        setItems(items.filter(item => item.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete item:', error)
    }
  }

  const handleCopy = (text: string, itemId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(itemId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-8">Content History</h1>
      
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
        {/* Filter */}
        <div className="mb-6">
          <label className="block text-white font-semibold mb-3">Filter by Type</label>
          <div className="flex gap-3">
            {(['all', 'blog', 'caption', 'tweet'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                  filter === f 
                    ? 'bg-white text-purple-600' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* History List */}
        {loading ? (
          <div className="text-center py-12 text-white/60">
            <p className="text-lg">Loading history...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-white/60">
            <p className="text-lg">No content generated yet.</p>
            <p className="mt-2">Start by generating some content!</p>
          </div>
        ) : (
          <div className="space-y-4">
                {items.map((item) => {
                  const isExpanded = expandedId === item.id

                  return (
                    <div key={item.id} className="bg-black/20 rounded-lg p-6 border border-white/10">
                      <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <span className="inline-block px-3 py-1 bg-purple-500/30 text-white text-sm rounded-full capitalize">
                        {item.type}
                      </span>
                      <p className="text-white/70 text-sm mt-2">
                        Topic: {item.input_text}
                      </p>
                      <p className="text-white/70 text-sm mt-1">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleCopy(item.generated_text, item.id)}
                        className="px-3 py-1 bg-white/20 text-white rounded hover:bg-white/30 transition text-sm"
                      >
                        {copiedId === item.id ? '✅ Copied!' : '📋 Copy'}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 bg-red-500/30 text-white rounded hover:bg-red-500/50 transition text-sm"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                  <div
                    className={`text-white prose prose-invert max-w-none mt-4 cursor-pointer ${!isExpanded ? 'line-clamp-2 overflow-hidden' : ''
                      }`}
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-3 text-white" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-2 mt-4 text-white" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-2 mt-3 text-white" {...props} />,
                        p: ({ node, ...props }) => <p className="mb-3 text-white/90 leading-relaxed" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-3 space-y-1 text-white/90" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-3 space-y-1 text-white/90" {...props} />,
                        li: ({ node, ...props }) => <li className="text-white/90" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
                        em: ({ node, ...props }) => <em className="italic text-white/95" {...props} />,
                        code: ({ node, ...props }) => <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm text-pink-300" {...props} />,
                      }}
                    >
                      {item.generated_text}
                    </ReactMarkdown>
                  </div>
                  {!isExpanded && (
                    <button
                      onClick={() => setExpandedId(item.id)}
                      className="text-cyan-400 text-sm mt-2 hover:text-cyan-300 transition"
                    >
                      Click to expand ▼
                    </button>
                  )}
                  {isExpanded && (
                    <button
                      onClick={() => setExpandedId(null)}
                      className="text-cyan-400 text-sm mt-2 hover:text-cyan-300 transition"
                    >
                      Click to collapse ▲
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
