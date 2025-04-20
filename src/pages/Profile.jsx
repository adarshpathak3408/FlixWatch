import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useHistory } from '../contexts/HistoryContext'
import { useWatchlist } from '../contexts/WatchlistContext'
import { useLike } from '../contexts/LikeContext'

const Profile = () => {
  const { user, logout } = useAuth()
  const { history, clearHistory } = useHistory()
  const { watchlist } = useWatchlist()
  const { likedMovies } = useLike()
  const [activeTab, setActiveTab] = useState('account')
  const navigate = useNavigate()
  
  // Redirect to home if not logged in
  if (!user) {
    navigate('/')
    return null
  }
  
  const handleLogout = () => {
    logout()
    navigate('/')
  }
  
  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="sticky top-32 glass-card p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-primary-600 flex items-center justify-center text-white text-3xl font-bold mb-4">
                  {user.name.charAt(0)}
                </div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
              
              <nav>
                <button
                  onClick={() => setActiveTab('account')}
                  className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors ${
                    activeTab === 'account'
                      ? 'bg-primary-600/20 text-primary-400'
                      : 'hover:bg-dark-100'
                  }`}
                >
                  Account Settings
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors ${
                    activeTab === 'history'
                      ? 'bg-primary-600/20 text-primary-400'
                      : 'hover:bg-dark-100'
                  }`}
                >
                  Watch History
                </button>
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors ${
                    activeTab === 'stats'
                      ? 'bg-primary-600/20 text-primary-400'
                      : 'hover:bg-dark-100'
                  }`}
                >
                  Activity Stats
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors mt-4"
                >
                  Logout
                </button>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="md:col-span-3"
          >
            {/* Account Settings */}
            {activeTab === 'account' && (
              <div className="glass-card p-6">
                <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Name</label>
                      <input
                        type="text"
                        value={user.name}
                        className="w-full bg-dark-200 border border-dark-100 rounded-lg px-4 py-2"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Email</label>
                      <input
                        type="email"
                        value={user.email}
                        className="w-full bg-dark-200 border border-dark-100 rounded-lg px-4 py-2"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="darkMode"
                        className="w-4 h-4 bg-dark-200 border-dark-100 rounded"
                        checked
                        readOnly
                      />
                      <label htmlFor="darkMode" className="ml-2">Dark Mode</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notifications"
                        className="w-4 h-4 bg-dark-200 border-dark-100 rounded"
                        checked
                        readOnly
                      />
                      <label htmlFor="notifications" className="ml-2">
                        Email Notifications for GroupWatch Invites
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Social Connections</h3>
                  <p className="text-gray-400 mb-4">
                    Connect your social accounts to easily invite friends to GroupWatch sessions.
                  </p>
                  <div className="space-y-4">
                    <button className="btn btn-ghost border border-white/20 w-full">
                      Connect Facebook
                    </button>
                    <button className="btn btn-ghost border border-white/20 w-full">
                      Connect Twitter
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Watch History */}
            {activeTab === 'history' && (
              <div className="glass-card p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Watch History</h2>
                  {history.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Clear History
                    </button>
                  )}
                </div>
                
                {history.length > 0 ? (
                  <div className="space-y-4">
                    {history.map((movie) => (
                      <div
                        key={movie.id}
                        className="flex items-center p-3 bg-dark-200 rounded-lg"
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w92${movie.poster}`}
                          alt={movie.title}
                          className="w-12 h-18 object-cover rounded mr-4"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = 'https://via.placeholder.com/92x138?text=No+Image'
                          }}
                        />
                        <div className="flex-grow">
                          <h4 className="font-medium">{movie.title}</h4>
                        </div>
                        <button
                          onClick={() => navigate(`/player/${movie.id}`)}
                          className="text-primary-400 hover:text-primary-300 text-sm"
                        >
                          Watch Again
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">Your watch history is empty</p>
                    <button
                      onClick={() => navigate('/')}
                      className="btn btn-primary"
                    >
                      Discover Movies
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Stats */}
            {activeTab === 'stats' && (
              <div className="glass-card p-6">
                <h2 className="text-2xl font-bold mb-6">Activity Stats</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-dark-200 p-4 rounded-lg text-center">
                    <h3 className="text-gray-400 text-sm mb-2">Trailers Watched</h3>
                    <p className="text-3xl font-bold">{history.length}</p>
                  </div>
                  
                  <div className="bg-dark-200 p-4 rounded-lg text-center">
                    <h3 className="text-gray-400 text-sm mb-2">In Watchlist</h3>
                    <p className="text-3xl font-bold">{watchlist.length}</p>
                  </div>
                  
                  <div className="bg-dark-200 p-4 rounded-lg text-center">
                    <h3 className="text-gray-400 text-sm mb-2">Liked Movies</h3>
                    <p className="text-3xl font-bold">{likedMovies.length}</p>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {history.slice(0, 5).map((movie, index) => (
                    <div key={index} className="flex items-center p-3 bg-dark-200 rounded-lg">
                      <div className="mr-4 text-gray-400 text-sm">
                        {index === 0 ? 'Just now' : `${index + 1}d ago`}
                      </div>
                      <div>
                        <span className="font-medium">You watched </span>
                        <span className="text-primary-400">{movie.title}</span>
                      </div>
                    </div>
                  ))}
                  
                  {likedMovies.slice(0, 2).map((movie, index) => (
                    <div key={`like-${index}`} className="flex items-center p-3 bg-dark-200 rounded-lg">
                      <div className="mr-4 text-gray-400 text-sm">
                        {index + 3}d ago
                      </div>
                      <div>
                        <span className="font-medium">You liked </span>
                        <span className="text-primary-400">{movie.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Profile