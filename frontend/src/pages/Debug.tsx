import { useAuth } from '../contexts/AuthContext'

export default function Debug() {
  const { user, session, loading } = useAuth()

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-8">🐛 Debug Info</h1>
      
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Auth State</h2>
          <div className="bg-black/30 p-4 rounded-lg text-white space-y-2">
            <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
            <div><strong>User Present:</strong> {user ? 'Yes' : 'No'}</div>
            <div><strong>Session Present:</strong> {session ? 'Yes' : 'No'}</div>
          </div>
        </div>

        {user && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">User Info</h2>
            <div className="bg-black/30 p-4 rounded-lg text-white space-y-2 font-mono text-sm">
              <div><strong>ID:</strong> {user.id}</div>
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>Created:</strong> {user.created_at}</div>
            </div>
          </div>
        )}

        {session && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Session Info</h2>
            <div className="bg-black/30 p-4 rounded-lg text-white space-y-2 font-mono text-sm">
              <div><strong>Access Token (first 50 chars):</strong> {session.access_token?.substring(0, 50)}...</div>
              <div><strong>Expires At:</strong> {new Date(session.expires_at! * 1000).toLocaleString()}</div>
            </div>
          </div>
        )}

        {!user && !loading && (
          <div className="text-center py-8">
            <p className="text-white/70 text-lg">Not logged in</p>
            <p className="text-white/50 mt-2">Go to Dashboard to sign in</p>
          </div>
        )}
      </div>
    </div>
  )
}
