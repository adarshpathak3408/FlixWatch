import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { LikeProvider } from './contexts/LikeContext.jsx'
import { HistoryProvider } from './contexts/HistoryContext.jsx'
import { WatchlistProvider } from './contexts/WatchlistContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LikeProvider>
          <HistoryProvider>
            <WatchlistProvider>
              <App />
            </WatchlistProvider>
          </HistoryProvider>
        </LikeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)