import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const TrendingSection = ({ movies }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const navigate = useNavigate()
  
  if (!movies || movies.length === 0) {
    return null
  }

  const handleCardClick = (movieId) => {
    navigate(`/player/${movieId}`)
  }

  return (
    <div className="trending-section">
      <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {movies.slice(0, 4).map((movie, index) => (
          <motion.div
            key={movie.id}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="relative overflow-hidden rounded-xl aspect-[2/3] shadow-lg cursor-pointer"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => handleCardClick(movie.id)}
          >
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title || movie.original_title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster'
              }}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-dark-500/90 via-dark-400/20 to-transparent opacity-90 transition-opacity duration-300"></div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="btn btn-primary px-6 py-2">
                Watch Now
              </span>
            </motion.div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="flex items-center mb-2">
                <span className="text-yellow-400 mr-1">★</span>
                <span className="text-sm">{movie.vote_average.toFixed(1)}</span>
              </div>
              <h3 className="text-lg font-bold line-clamp-2">
                {movie.title || movie.original_title}
              </h3>
              <p className="text-sm opacity-80">
                {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Coming Soon'}
              </p>
            </div>
            
            <div className="absolute top-2 right-2 bg-accent-600/90 text-white text-xs font-bold px-2 py-1 rounded-md">
              #{index + 1}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default TrendingSection