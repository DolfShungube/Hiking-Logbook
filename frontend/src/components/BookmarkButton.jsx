import React, { useState } from 'react';
import { useBookmark } from '../context/BookmarkContext';
import { Heart } from 'lucide-react';

const BookmarkButton = ({ hikeId, size = 'medium' }) => {
  const { isBookmarked, toggleBookmark, actionLoading } = useBookmark();
  const [isAnimating, setIsAnimating] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleClick = async (e) => {
    e.stopPropagation(); // Prevent card click when clicking bookmark
    
    if (actionLoading) return;
    
    setLocalError(null);
    setIsAnimating(true);
    
    try {
      const success = await toggleBookmark(hikeId);
      if (!success) {
        setLocalError('Failed to toggle bookmark');
      }
    } catch (err) {
      console.error('Bookmark error:', err);
      setLocalError(err.message || 'Failed to update bookmark');
      setTimeout(() => setLocalError(null), 2000);
    } finally {
      setTimeout(() => setIsAnimating(false), 200);
    }
  };

  const isBooked = isBookmarked(hikeId);

  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-10 h-10'
  };

  const iconSizes = {
    small: 14,
    medium: 16,
    large: 20
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={actionLoading}
        className={`
          relative flex items-center justify-center
          rounded-full border transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-offset-1
          ${sizeClasses[size]}
          ${
            isBooked
              ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100 focus:ring-red-300'
              : 'bg-white/90 border-gray-300 text-gray-400 hover:bg-white hover:text-gray-600 focus:ring-blue-300'
          }
          ${isAnimating ? 'scale-110' : 'scale-100'}
          ${actionLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          shadow-sm hover:shadow-md backdrop-blur-sm
        `}
        title={isBooked ? 'Remove from bookmarks' : 'Add to bookmarks'}
      >
        <Heart
          size={iconSizes[size]}
          fill={isBooked ? 'currentColor' : 'none'}
          className={`transition-all duration-300 ${
            isAnimating ? 'scale-125' : 'scale-100'
          }`}
        />
        
        {actionLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
      </button>
      
      {/* Error message */}
      {localError && (
        <div className="absolute top-full right-0 mt-1 bg-red-100 border border-red-300 text-red-700 px-2 py-1 rounded text-xs whitespace-nowrap z-50">
          {localError}
        </div>
      )}
    </>
  );
};

export default BookmarkButton;