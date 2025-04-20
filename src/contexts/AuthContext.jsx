import { createContext, useContext, useState, useEffect } from 'react'

// Create the context
const AuthContext = createContext(null)

// Provider component that wraps the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Simulate loading user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])
  
  // Simulate login
  const login = () => {
    // For demo purposes, create a mock user
    const mockUser = {
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com'
    }
    
    setUser(mockUser)
    localStorage.setItem('user', JSON.stringify(mockUser))
  }
  
  // Simulate logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }
  
  // Context value
  const value = {
    user,
    loading,
    login,
    logout
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}