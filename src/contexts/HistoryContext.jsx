import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const HistoryContext = createContext(null);

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem('watchHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('watchHistory', JSON.stringify(history));
  }, [history]);

  const addToHistory = useCallback((movie) => {
    setHistory((prev) => {
      const filtered = prev.filter((m) => m.id !== movie.id);
      return [movie, ...filtered];
    });
  }, []);

  const removeFromHistory = useCallback((movieId) => {
    setHistory((prev) => prev.filter((movie) => movie.id !== movieId));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const value = {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};