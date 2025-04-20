import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { searchMovies, fetchGenres, fetchMoviesByGenre } from '../utils/api'
import LoadingScreen from '../components/ui/LoadingScreen'

const Explore = () => {
  const [searchParams] = useSearchParams()
  const [movies, setMovies] = useState([])
  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  
  const query = searchParams.get('query')
  
  useEffect(() => {
    // Fetch genres once
    const getGenres = async () => {
      try {
        const genreData = await fetchGenres()
        setGenres(genreData.genres || [])
      } catch (error) {
        console.error('Error fetching genres:', error)
      }
    }
    
    getGenres()
  }, [])
  
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true)
      
      try {
        let data
        if (query) {
          // If we have a search query, search for movies
          data = await searchMovies(query)
        } else if (selectedGenre) {
          // If a genre is selected, fetch movies by genre
          data = await fetchMoviesByGenre(selectedGenre)
        } else {
          // Default: fetch trending movies
          data = await searchMovies('a')
        }
        
        setMovies(data.results || [])
      } catch (error) {
        console.error('Error fetching movies:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchMovies()
  }, [query, selectedGenre])
  
  // Handle genre selection
  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId)
  }
  
  if (isLoading) {
    return <LoadingScreen />
  }
  
  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {query ? `Search Results for "${query}"` : 'Explore Movies'}
          </h1>
          
          {!query && (
            <div className="overflow-x-auto pb-4">
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleGenreChange('')}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                    selectedGenre === ''
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-100/50 hover:bg-dark-100 text-gray-300'
                  }`}
                >
                  All Movies
                </button>
                
                {genres.map(genre => (
                  <button 
                    key={genre.id}
                    onClick={() => handleGenreChange(genre.id)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                      selectedGenre === genre.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-dark-100/50 hover:bg-dark-100 text-gray-300'
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {movies.length > 0 ? (
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {movies.map((movie) => (
              <motion.div
                key={movie.id}
                whileHover={{ scale: 1.05 }}
                className="movie-card overflow-hidden rounded-lg shadow-lg"
              >
                <a href={`/player/${movie.id}`} className="block">
                  <div className="relative aspect-[2/3]">
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : 'https://via.placeholder.com/500x750?text=No+Poster'
                      }
                      alt={movie.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-500/90 via-dark-400/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button className="btn btn-primary">Watch Trailer</button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-dark-200">
                    <h3 className="font-semibold text-white line-clamp-1">{movie.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span className="text-sm text-gray-300">
                          {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-400">
                        {movie.release_date
                          ? new Date(movie.release_date).getFullYear()
                          : 'Unknown'
                        }
                      </span>
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">No movies found</h2>
            <p className="text-gray-400">
              {query 
                ? `We couldn't find any movies matching "${query}"`
                : 'Try selecting a different genre or search term'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Explore