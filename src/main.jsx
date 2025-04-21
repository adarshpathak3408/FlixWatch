import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { LikeProvider } from './contexts/LikeContext';
import { HistoryProvider } from './contexts/HistoryContext';
import { WatchlistProvider } from './contexts/WatchlistContext';

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
  </StrictMode>
);