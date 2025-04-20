import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LikeContext = createContext(null);

export const LikeProvider = ({ children }) => {
  const [likedMovies, setLikedMovies] = useState([]);

  useEffect(() => {
    const storedLikes = localStorage.getItem('likedMovies');
    if (storedLikes) {
      setLikedMovies(JSON.parse(storedLikes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('likedMovies', JSON.stringify(likedMovies));
  }, [likedMovies]);

  const likeMovie = useCallback((movie) => {
    setLikedMovies((prev) => {
      if (prev.some((m) => m.id === movie.id)) {
        return prev;
      }
      return [...prev, movie];
    });
  }, []);

  const removeLikedMovie = useCallback((movieId) => {
    setLikedMovies((prev) => prev.filter((movie) => movie.id !== movieId));
  }, []);

  const value = {
    likedMovies,
    likeMovie,
    removeLikedMovie,
  };

  return <LikeContext.Provider value={value}>{children}</LikeContext.Provider>;
};

export const useLike = () => {
  const context = useContext(LikeContext);
  if (!context) {
    throw new Error('useLike must be used within a LikeProvider');
  }
  return context;
};