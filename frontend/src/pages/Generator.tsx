import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useAuth } from '../contexts/AuthContext'

type ContentType = 'blog' | 'caption' | 'tweet'

export default function Generator() {
  const { user, session } = useAuth()
  const [type, setType] = useState<ContentType>('blog')
  const [topic, setTopic] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const [selectedModel, setSelectedModel] = useState<'groq' | 'custom'>('groq') // Model selection state

  const handleGenerate = async () => {
    if (!topic.trim()) return
    
    setLoading(true)
    setResult('') // Clear previous result
    setSaveMessage('') // Clear save message
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      console.log('Calling API:', `${apiUrl}/generate/`)
      console.log('Request body:', { type, topic, user_id: user?.id })

      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`

      const response = await fetch(`${apiUrl}/generate/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          type, 
          topic,
          user_id: user?.id || 'anonymous',
          model: selectedModel  // Send selected model to backend
        })
      })
      
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
      }
      
      const data = await response.json()
      console.log('Response data:', data)
      setResult(data.generated_text || 'No content generated')
      // Don't auto-save - user will click "Save to History" button if they want to save
    } catch (error) {
      console.error('Full error:', error)
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
  }

  const handleSaveToHistory = async () => {
    if (!result || !topic.trim()) return

    setSaving(true)
    setSaveMessage('')
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`

      const response = await fetch(`${apiUrl}/history/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          type,
          input_text: topic,
          generated_text: result,
          user_id: user?.id || 'anonymous'
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error('Failed to save to history')
      }

      setSaveMessage('✅ Saved to history successfully!')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      console.error('Error saving to history:', error)
      setSaveMessage('❌ Failed to save to history')
      setTimeout(() => setSaveMessage(''), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-8">Content Generator</h1>
      
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
        <div className="mb-6">
          <label className="block text-white font-semibold mb-3">Content Type</label>
          <div className="flex gap-4">
            {(['blog', 'caption', 'tweet'] as ContentType[]).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-6 py-3 rounded-lg font-semibold transition capitalize ${
                  type === t 
                    ? 'bg-white text-purple-600 shadow-lg' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-white font-semibold mb-3">Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter your topic..."
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>

        {/* Model Selection Toggle */}
        <div className="mb-6">
          <label className="block text-white font-semibold mb-3">AI Model</label>
          <div className="relative inline-flex w-full bg-white/10 rounded-lg p-1 border border-white/20">
            <button
              onClick={() => setSelectedModel('groq')}
              className={`flex-1 px-6 py-3 rounded-md font-semibold transition-all duration-200 ${selectedModel === 'groq'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
                }`}
            >
              ⚡ Groq AI
            </button>
            <button
              onClick={() => setSelectedModel('custom')}
              className={`flex-1 px-6 py-3 rounded-md font-semibold transition-all duration-200 ${selectedModel === 'custom'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
                }`}
            >
              🤖 Custom AI
            </button>
          </div>
          <p className="text-white/60 text-sm mt-2">
            {selectedModel === 'groq'
              ? '⚡ Using Groq API with Llama 3.3 70B model'
              : '🤖 Using Custom AI model (Gemma-2-2B based)'}
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !topic.trim()}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : '✨ Generate Content'}
        </button>

        {result && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-semibold text-lg">Generated Content</h3>
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition text-sm font-medium"
                >
                  {copied ? '✅ Copied!' : '📋 Copy'}
                </button>
                <button
                  onClick={handleSaveToHistory}
                  disabled={saving}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? '💾 Saving...' : '💾 Save to History'}
                </button>
              </div>
            </div>
            {saveMessage && (
              <div className={`mb-3 px-4 py-2 rounded-lg text-sm font-medium ${saveMessage.includes('✅')
                ? 'bg-green-500/20 text-green-200 border border-green-500/30'
                : 'bg-red-500/20 text-red-200 border border-red-500/30'
                }`}>
                {saveMessage}
              </div>
            )}
            <div className="bg-black/30 rounded-lg p-6 text-white prose prose-invert prose-lg max-w-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-4 text-white" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-2xl font-bold mb-3 mt-6 text-white" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl font-bold mb-2 mt-4 text-white" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4 text-white/90 leading-relaxed" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2 text-white/90" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2 text-white/90" {...props} />,
                  li: ({node, ...props}) => <li className="text-white/90" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                  em: ({node, ...props}) => <em className="italic text-white/95" {...props} />,
                  code: ({node, ...props}) => <code className="bg-white/10 px-2 py-1 rounded text-sm text-pink-300" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-purple-400 pl-4 italic text-white/80 my-4" {...props} />,
                }}
              >
                {result}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
