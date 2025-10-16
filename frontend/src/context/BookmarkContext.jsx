import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from "@supabase/supabase-js";
import { UserAuth } from './AuthContext';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
  const [bookmarkedHikes, setBookmarkedHikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = UserAuth();

  // Fetch user's bookmarked hikes
  const fetchBookmarkedHikes = async (userId) => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('BookmarkedHikes')
        .select('hikeid')
        .eq('userid', userId);

      if (error) throw error;

      const bookmarkedIds = data.map(item => item.hikeid);
      setBookmarkedHikes(bookmarkedIds);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check if a hike is bookmarked
  const isBookmarked = (hikeId) => {
    return bookmarkedHikes.includes(hikeId);
  };

  // Add bookmark
  const addBookmark = async (hikeId) => {
    if (!currentUser?.id) {
      alert('Please log in to bookmark hikes');
      return false;
    }

    try {
      const { error } = await supabase
        .from('BookmarkedHikes')
        .insert([{ 
          hikeid: hikeId,
          userid: currentUser.id 
        }]);

      if (error) throw error;

      setBookmarkedHikes(prev => [...prev, hikeId]);
      return true;
    } catch (err) {
      console.error('Error adding bookmark:', err);
      alert(`Error: ${err.message}`);
      return false;
    }
  };

  // Remove bookmark
  const removeBookmark = async (hikeId) => {
    if (!currentUser?.id) return false;

    try {
      const { error } = await supabase
        .from('BookmarkedHikes')
        .delete()
        .eq('hikeid', hikeId)
        .eq('userid', currentUser.id);

      if (error) throw error;

      setBookmarkedHikes(prev => prev.filter(id => id !== hikeId));
      return true;
    } catch (err) {
      console.error('Error removing bookmark:', err);
      alert(`Error: ${err.message}`);
      return false;
    }
  };

  // Toggle bookmark
  const toggleBookmark = async (hikeId) => {
    if (isBookmarked(hikeId)) {
      return await removeBookmark(hikeId);
    } else {
      return await addBookmark(hikeId);
    }
  };

  // Refresh bookmarks when user changes
  useEffect(() => {
    if (currentUser?.id) {
      fetchBookmarkedHikes(currentUser.id);
    } else {
      setBookmarkedHikes([]);
    }
  }, [currentUser]);

  const value = {
    bookmarkedHikes,
    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    loading,
    refreshBookmarks: () => currentUser?.id && fetchBookmarkedHikes(currentUser.id)
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmark = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmark must be used within a BookmarkProvider');
  }
  return context;
};