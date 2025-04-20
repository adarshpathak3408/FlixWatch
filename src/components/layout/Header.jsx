import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import SearchBar from '../ui/SearchBar'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, login, logout } = useAuth()
  const location = useLocation()
  
  // Navigation links
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Watchlist', path: '/watchlist' },
    { name: 'Group Watch', path: '/groupwatch' }
  ]
  
  // Update header background on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-dark-300/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold title-gradient">
            TrailerHub
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors hover:text-primary-400 ${
                  location.pathname === link.path 
                    ? 'text-primary-500' 
                    : 'text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          {/* Search and Profile */}
          <div className="flex items-center space-x-4">
            <SearchBar />
            
            {user ? (
              <div className="relative group">
                <button className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0)}
                </button>
                
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-dark-200 ring-1 ring-dark-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                  <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-dark-100">
                    Profile
                  </Link>
                  <Link to="/watchlist" className="block px-4 py-2 text-sm hover:bg-dark-100">
                    My Watchlist
                  </Link>
                  <button 
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-dark-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={login}
                className="btn btn-primary"
              >
                Sign In
              </button>
            )}
            
            {/* Mobile Menu Button */}
            <button
              className="block md:hidden p-2 text-white focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-300 border-t border-dark-100"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-md font-medium ${
                      location.pathname === link.path 
                        ? 'bg-primary-600/20 text-primary-400' 
                        : 'hover:bg-dark-200'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                
                {!user && (
                  <button
                    onClick={login}
                    className="btn btn-primary mt-3"
                  >
                    Sign In
                  </button>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header