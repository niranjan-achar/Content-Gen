import { useState, useEffect } from 'react'

interface Reminder {
  id: string
  user_id: string
  title: string
  topic?: string
  date?: string
  time?: string
  daily: boolean
  repeat_days?: number[]
  created_at?: string
}

interface ReminderForm {
  title: string
  topic: string
  date: string
  time: string
  daily: boolean
}

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ReminderForm>({
    title: '',
    topic: '',
    date: '',
    time: '',
    daily: false
  })

  useEffect(() => {
    fetchReminders()
  }, [])

  const fetchReminders = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/reminders/`)
      const data = await response.json()
      setReminders(data)
    } catch (error) {
      console.error('Failed to fetch reminders:', error)
    }
  }

  const handleCreate = async () => {
    if (!formData.title.trim()) return
    
    setLoading(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/reminders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          topic: formData.topic || null,
          date: formData.date || null,
          time: formData.time || null,
          daily: formData.daily,
          user_id: 'demo-user' // In production, get from Supabase auth
        })
      })
      
      if (response.ok) {
        await fetchReminders()
        setShowForm(false)
        setFormData({ title: '', topic: '', date: '', time: '', daily: false })
      }
    } catch (error) {
      console.error('Failed to create reminder:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/reminders/${id}/`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchReminders()
      }
    } catch (error) {
      console.error('Failed to delete reminder:', error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Reminders</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition"
        >
          ➕ Create Reminder
        </button>
      </div>

      {showForm && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">New Reminder</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">Title</label>
              <input
                type="text"
                placeholder="Reminder title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2">Topic (optional)</label>
              <input
                type="text"
                placeholder="Content topic"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="daily"
                checked={formData.daily}
                onChange={(e) => setFormData({ ...formData, daily: e.target.checked })}
                className="w-5 h-5 rounded"
              />
              <label htmlFor="daily" className="text-white font-medium">Daily reminder</label>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handleCreate}
                disabled={loading || !formData.title.trim()}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create'}
              </button>
              <button
                onClick={() => {
                  setShowForm(false)
                  setFormData({ title: '', topic: '', date: '', time: '', daily: false })
                }}
                className="flex-1 bg-white/20 text-white font-semibold py-3 rounded-lg hover:bg-white/30 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reminders List */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
        {reminders.length === 0 ? (
          <div className="text-center py-12 text-white/60">
            <p className="text-lg">No reminders yet.</p>
            <p className="mt-2">Create your first reminder to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="bg-black/20 rounded-lg p-6 border border-white/10 flex justify-between items-start">
                <div>
                  <h3 className="text-white font-semibold text-lg">{reminder.title}</h3>
                  {reminder.topic && <p className="text-white/70 mt-1">Topic: {reminder.topic}</p>}
                  {reminder.date && (
                    <p className="text-white/70 mt-1">
                      📅 {reminder.date} {reminder.time || ''}
                    </p>
                  )}
                  {reminder.daily && <span className="inline-block mt-2 px-3 py-1 bg-green-500/30 text-white text-sm rounded-full">Daily</span>}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleDelete(reminder.id)}
                    className="px-3 py-1 bg-red-500/30 text-white rounded hover:bg-red-500/50 transition text-sm"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
