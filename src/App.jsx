import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import LoadingScreen from './components/ui/LoadingScreen'

// Use lazy loading to improve initial load performance
const Home = lazy(() => import('./pages/Home'))
const Player = lazy(() => import('./pages/Player'))
const Watchlist = lazy(() => import('./pages/Watchlist'))
const Explore = lazy(() => import('./pages/Explore'))
const GroupWatch = lazy(() => import('./pages/GroupWatch'))
const Profile = lazy(() => import('./pages/Profile'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  const location = useLocation()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col bg-dark-300 text-white">
      <Header />
      <main className="flex-grow">
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/player/:id" element={<Player />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/groupwatch/:roomId?" element={<GroupWatch />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default App