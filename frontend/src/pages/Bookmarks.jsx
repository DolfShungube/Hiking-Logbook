import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { createClient } from "@supabase/supabase-js";
import { Bookmark, Mountain, MapPin, Calendar, Users, TrendingUp, Gauge, X, ArrowRight } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Bookmarks = () => {
  const [bookmarkedHikes, setBookmarkedHikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const { currentUser, authLoading } = UserAuth();
  const userId = currentUser?.id;

  useEffect(() => {
    console.log('🔐 Auth Debug:', {
      currentUser,
      authLoading,
      userId,
      hasUser: !!currentUser,
      userIsNull: currentUser === null
    });

    if (authLoading) {
      console.log('⏳ Auth context still loading...');
      return;
    }

    if (currentUser === null) {
      console.log('❌ No user - redirecting to login');
      setError('Please log in to view bookmarks');
      setLoading(false);
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (userId) {
      console.log('✅ User authenticated, fetching bookmarks for:', userId);
      fetchBookmarkedHikes(userId);
    }
  }, [currentUser, authLoading, userId, navigate]);

  const fetchBookmarkedHikes = async (uid) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Fetching bookmarks from Supabase for user:', uid);
      
      const { data: bookmarks, error: bookmarksError } = await supabase
        .from('BookmarkedHikes')
        .select('hikeid, created_at')
        .eq('userid', uid);
  
      if (bookmarksError) throw bookmarksError;
  
      console.log('🔍 Bookmarked hike IDs:', bookmarks);
  
      if (bookmarks.length === 0) {
        setBookmarkedHikes([]);
        setLoading(false);
        return;
      }
  
      const hikeIds = bookmarks.map(bookmark => bookmark.hikeid);
      console.log('🏔️ Hike IDs to fetch:', hikeIds);
      
      const { data: hikesData, error: hikesError } = await supabase
        .from('HikeData')
        .select('*')
        .in('hikeid', hikeIds);
  
      if (hikesError) throw hikesError;
  
      console.log('🏔️ HikeData results:', hikesData);
  
      const transformedHikes = bookmarks.map(bookmark => {
        const hike = hikesData.find(h => h.hikeid === bookmark.hikeid);

        console.log('🔗 Matching hike for', bookmark.hikeid, ':', hike);
        
        if (hike) {
          return {
            hikeid: bookmark.hikeid,
            title: hike.title || 'Bookmarked Hike',
            location: hike.location || 'Unknown Location',
            distance: hike.distance || 0,
            elevation: hike.elevation || 0,
            difficulty: hike.difficulty || 'moderate',
            startdate: hike.startdate || bookmark.created_at,
            hikinggroup: hike.hikinggroup ? JSON.stringify(hike.hikinggroup) : 'Solo',
            bookmarked_at: bookmark.created_at,
            weather: hike.weather,
            enddate: hike.enddate,
            route: hike.route,
            friends: hike.friends,
            friendlist: hike.friendlist
          };
        } else {
          console.log('⚠️ No matching hike data found for:', bookmark.hikeid);
          return {
            hikeid: bookmark.hikeid,
            title: `Hike ${bookmark.hikeid.substring(0, 8)}...`,
            location: 'Location not available',
            distance: 0,
            elevation: 0,
            difficulty: 'unknown',
            startdate: bookmark.created_at,
            status: 'bookmarked',
            hikinggroup: 'Not specified',
            bookmarked_at: bookmark.created_at
          };
        }
      });
  
      console.log('✅ Final transformed hikes:', transformedHikes);
      setBookmarkedHikes(transformedHikes);
      
    } catch (err) {
      console.error('❌ Error fetching bookmarks:', err);
      setError(err.message || 'Failed to fetch bookmarks');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (hikeId) => {
    if (!userId) {
      alert('Please log in to remove bookmarks');
      return;
    }

    if (!window.confirm('Are you sure you want to remove this bookmark?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('BookmarkedHikes')
        .delete()
        .eq('hikeid', hikeId)
        .eq('userid', userId);

      if (error) throw error;

      setBookmarkedHikes(prev => prev.filter(hike => hike.hikeid !== hikeId));
      alert('Bookmark removed successfully!');
    } catch (err) {
      console.error('Error removing bookmark:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleViewHike = (hikeId) => {
    navigate(`/dashboard/hike/${hikeId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const getDifficultyStyle = (difficulty) => {
    const lower = difficulty?.toLowerCase();
    if (lower === 'easy') {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    }
    if (lower === 'moderate') {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    }
    if (lower === 'hard') {
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {authLoading ? 'Checking authentication...' : 'Loading your bookmarked hikes...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 max-w-md">
          <div className="text-red-500 mb-4">
            <Mountain className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">Error</h2>
          <p className="text-red-600 dark:text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 dark:bg-blue-600/20 rounded-full mb-4">
              <Bookmark className="w-8 h-8 text-blue-500 dark:text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
              My Bookmarked Hikes
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {bookmarkedHikes.length} {bookmarkedHikes.length === 1 ? 'Bookmarked Hike' : 'Bookmarked Hikes'}  
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {bookmarkedHikes.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Bookmark className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              No bookmarks yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              Start exploring and bookmark your favorite hikes!
            </p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              Explore Hikes
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedHikes.map((hike) => (
              <div 
                key={hike.hikeid}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all overflow-hidden group"
              >
                {/* Card Header with gradient */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 relative">
                  <div className="flex justify-between items-start">
                    <h3 className="text-white font-semibold text-lg line-clamp-2 pr-8">
                      {hike.title || hike.location || 'Unnamed Hike'}
                    </h3>
                    <button
                      onClick={() => handleRemoveBookmark(hike.hikeid)}
                      className="absolute top-3 right-3 p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm"
                      title="Remove bookmark"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <div className="space-y-3">
                    {/* Location */}
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm line-clamp-1">{hike.location || 'N/A'}</span>
                    </div>

                    {/* Distance & Elevation */}
                    <div className="flex items-center gap-4 text-sm">
                      {hike.distance > 0 && (
                        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                          <Gauge className="w-4 h-4" />
                          <span>{hike.distance} km</span>
                        </div>
                      )}
                      {hike.elevation > 0 && (
                        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                          <TrendingUp className="w-4 h-4" />
                          <span>{hike.elevation} m</span>
                        </div>
                      )}
                    </div>

                    {/* Difficulty */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Difficulty:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyStyle(hike.difficulty)}`}>
                        {hike.difficulty || 'N/A'}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{formatDate(hike.startdate)}</span>
                    </div>

                    {/* Group Size */}
                    {hike.hikinggroup && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">
                          {Array.isArray(hike.hikinggroup) 
                            ? (hike.hikinggroup.length === 1 ? '1 person' : `${hike.hikinggroup.length} people`)
                            : '1 person'
                          }
                        </span>
                      </div>
                    )}

                    {/* Bookmarked Date */}
                    {hike.bookmarked_at && (
                      <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>Bookmarked:</span>
                          <span>{formatDate(hike.bookmarked_at)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>


              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;