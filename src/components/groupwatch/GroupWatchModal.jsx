import { useState, useEffect, useRef } from 'react';
import { IoClose, IoShareSocial, IoHeart, IoHeartOutline } from 'react-icons/io5';
import { useAuth } from '../../contexts/AuthContext';
import { useLike } from '../../contexts/LikeContext';
import { useGroupWatch } from '../../contexts/GroupWatchContext';
import ChatPanel from './ChatPanel';

const GroupWatchModal = ({ movie, onClose }) => {
  const { user } = useAuth();
  const { likedMovies, likeMovie, removeLikedMovie } = useLike();
  const {
    currentRoom,
    joinRoom,
    leaveRoom,
    messages,
    users,
    isHost,
    playbackState,
    sendPlaybackUpdate,
    requestSync,
    sendMessage
  } = useGroupWatch();
  
  const [roomId, setRoomId] = useState('');
  const [inviteUrl, setInviteUrl] = useState('');
  const playerRef = useRef(null);
  const isLiked = likedMovies.some(m => m.id === movie.id);

  useEffect(() => {
    // Generate room ID if creating new room
    if (!currentRoom && !roomId) {
      const newRoomId = Math.random().toString(36).substring(2, 10);
      setRoomId(newRoomId);
      setInviteUrl(`${window.location.origin}/groupwatch/${newRoomId}`);
    }
  }, [currentRoom, roomId]);

  useEffect(() => {
    if (currentRoom && movie) {
      joinRoom(currentRoom, movie);
    }
  }, [currentRoom, movie, joinRoom]);

  useEffect(() => {
    return () => {
      leaveRoom();
    };
  }, [leaveRoom]);

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(inviteUrl)
      .then(() => {
        sendMessage('Invite link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy invite link:', err);
      });
  };

  const handleLike = () => {
    if (isLiked) {
      removeLikedMovie(movie.id);
    } else {
      likeMovie({
        id: movie.id,
        title: movie.title,
        poster: movie.poster
      });
      sendMessage('❤️ liked this trailer!');
    }
  };

  const togglePlayPause = () => {
    if (!playerRef.current) return;
    
    const newIsPlaying = !playbackState.isPlaying;
    const currentTime = playerRef.current.getCurrentTime();
    
    sendPlaybackUpdate(newIsPlaying, currentTime);
    
    if (newIsPlaying) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  };

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
    
    // Sync with host if not host
    if (!isHost) {
      requestSync();
      playerRef.current.seekTo(playbackState.currentTime);
      if (playbackState.isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  };

  const onPlayerStateChange = (event) => {
    if (!isHost || !playerRef.current) return;
    
    // Only sync play/pause and time updates from host
    if (event.data === window.YT.PlayerState.PLAYING || 
        event.data === window.YT.PlayerState.PAUSED) {
      const currentTime = playerRef.current.getCurrentTime();
      sendPlaybackUpdate(
        event.data === window.YT.PlayerState.PLAYING,
        currentTime
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-500/95">
      <div className="w-full h-full md:h-auto md:w-auto md:max-w-6xl md:max-h-[90vh] bg-dark-300 rounded-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Video Player */}
        <div className="w-full md:w-3/4 h-[40vh] md:h-auto relative">
          {/* Close Button */}
          <button 
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-dark-400/70 hover:bg-dark-300 transition-colors"
            onClick={onClose}
          >
            <IoClose size={24} />
          </button>
          
          {/* Trailer Player */}
          <div className="w-full h-full">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${movie.trailerKey}?enablejsapi=1`}
              title={`${movie.title} - Group Watch`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              onLoad={(e) => {
                // Inject YouTube API script if not already loaded
                if (!window.YT) {
                  const tag = document.createElement('script');
                  tag.src = "https://www.youtube.com/iframe_api";
                  const firstScriptTag = document.getElementsByTagName('script')[0];
                  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                }
              }}
              id="yt-player"
            ></iframe>
          </div>
          
          {/* Control Bar */}
          <div className="bg-dark-400 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {isHost && (
                <button 
                  onClick={togglePlayPause}
                  className="btn btn-primary flex items-center space-x-2"
                >
                  <span>{playbackState.isPlaying ? 'Pause for All' : 'Play for All'}</span>
                </button>
              )}
              
              <button 
                onClick={handleLike}
                className={`btn ${isLiked ? 'btn-accent' : 'btn-ghost border border-white/20'}`}
              >
                {isLiked ? <IoHeart /> : <IoHeartOutline />}
              </button>
            </div>
            
            <div>
              <div className="text-xs text-gray-400">Room ID: {currentRoom}</div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Chat & Participants */}
        <div className="w-full md:w-1/4 bg-dark-400 flex flex-col border-l border-dark-100">
          {/* Room Info */}
          <div className="p-4 border-b border-dark-100">
            <h3 className="text-lg font-bold mb-2">{movie.title}</h3>
            <p className="text-sm text-gray-300 mb-4">Group Watch Room</p>
            
            <div className="flex flex-wrap gap-2">
              {users.map(user => (
                <span 
                  key={user.userId}
                  className={`text-xs px-2 py-1 rounded-full ${
                    user.isHost 
                      ? 'bg-primary-600/30 text-primary-400' 
                      : 'bg-dark-100/80 text-gray-300'
                  }`}
                >
                  {user.username} {user.isHost ? '(Host)' : ''}
                </span>
              ))}
            </div>
            
            <button
              onClick={handleCopyInvite}
              className="btn btn-ghost border border-white/20 w-full mt-4 flex items-center justify-center gap-2"
            >
              <IoShareSocial size={16} />
              <span>Copy Invite Link</span>
            </button>
          </div>
          
          {/* Chat Panel */}
          <ChatPanel 
            messages={messages} 
            onSendMessage={sendMessage}
            currentUser={user?.name || 'You'}
          />
        </div>
      </div>
    </div>
  );
};

export default GroupWatchModal;