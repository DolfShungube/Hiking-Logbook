import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Bookmarks = () => {
  const [bookmarkedHikes, setBookmarkedHikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Use the correct property from your auth context
  const { currentUser, authLoading } = UserAuth();
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const userId = currentUser?.id;

  useEffect(() => {
    console.log('🔐 Auth Debug:', {
      currentUser,
      authLoading,
      userId,
      hasUser: !!currentUser,
      userIsNull: currentUser === null
    });

    // Handle auth loading state
    if (authLoading) {
      console.log('⏳ Auth context still loading...');
      return;
    }

    // Handle no user after auth has loaded
    if (currentUser === null) {
      console.log(' No user - redirecting to login');
      setError('Please log in to view bookmarks');
      setLoading(false);
      // Optional: redirect after short delay
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (userId) {
      console.log(' User authenticated, fetching bookmarks for:', userId);
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
  
      // Extracthike IDs
      const hikeIds = bookmarks.map(bookmark => bookmark.hikeid);
      console.log('🔍 Hike IDs to fetch:', hikeIds);
      
    
      const { data: hikesData, error: hikesError } = await supabase
        .from('HikeData')
        .select('*')
        .in('hikeid', hikeIds);
  
      if (hikesError) throw hikesError;
  
      console.log(' HikeData results:', hikesData);
  
      // Combine the data
      const transformedHikes = bookmarks.map(bookmark => {
        // Find the matching hike data using hikeid
        const hike = hikesData.find(h => h.hikeid === bookmark.hikeid);  // Changed from 'hiked1' to 'hikeid'
        
        console.log(' Matching hike for', bookmark.hikeid, ':', hike);
        
        if (hike) {
          // We found hike data - use it with the correct column names
          return {
            hikeid: bookmark.hikeid,  // Changed from 'hiked1' to 'hikeid'
            title: hike.title || 'Bookmarked Hike',
            location: hike.location || 'Unknown Location',
            distance: hike.distance || 0,
            elevation: hike.elevation || 0,
            difficulty: hike.difficulty || 'moderate',
            startdate: hike.startdate || bookmark.created_at,
            status: hike.status || 'complete',
            hikinggroup: hike.hikinggroup ? JSON.stringify(hike.hikinggroup) : 'Solo',
            bookmarked_at: bookmark.created_at,
            weather: hike.weather,
            enddate: hike.enddate,
            route: hike.route,
            friends: hike.friends,
            friendlist: hike.friendlist
          };
        } else {
          // No matching hike data found - use fallback
          console.log(' No matching hike data found for:', bookmark.hikeid);
          return {
            hikeid: bookmark.hikeid,  // Changed from 'hiked1' to 'hikeid'
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
  
      console.log('Final transformed hikes:', transformedHikes);
      setBookmarkedHikes(transformedHikes);
      
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
      setError(err.message || 'Failed to fetch bookmarks');
    } finally {
      setLoading(false);
    }
  };

  // Remove a bookmark 
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
        .eq('hiked1', hikeId)
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
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const styles = {
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '2rem',
      minHeight: '100vh'
    },
    header: {
      marginBottom: '2rem',
      textAlign: 'center'
    },
    title: {
      fontSize: '2.5rem',
      color: '#2c3e50',
      marginBottom: '0.5rem'
    },
    subtitle: {
      color: '#7f8c8d',
      fontSize: '1.1rem'
    },
    loading: {
      textAlign: 'center',
      padding: '3rem',
      fontSize: '1.2rem',
      color: '#7f8c8d'
    },
    errorContainer: {
      textAlign: 'center',
      padding: '3rem',
      color: '#e74c3c'
    },
    errorButton: {
      marginTop: '1rem',
      padding: '0.75rem 1.5rem',
      background: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem'
    },
    emptyState: {
      textAlign: 'center',
      padding: '4rem 2rem',
      background: '#f8f9fa',
      borderRadius: '12px',
      marginTop: '2rem'
    },
    emptyIcon: {
      fontSize: '5rem',
      marginBottom: '1rem'
    },
    emptyTitle: {
      color: '#2c3e50',
      marginBottom: '1rem'
    },
    emptyText: {
      color: '#7f8c8d',
      fontSize: '1.1rem',
      marginBottom: '2rem'
    },
    primaryButton: {
      padding: '1rem 2rem',
      background: '#27ae60',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      cursor: 'pointer'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '1.5rem',
      marginTop: '2rem'
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      display: 'flex',
      flexDirection: 'column'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '1.5rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    },
    cardTitle: {
      fontSize: '1.3rem',
      margin: 0,
      flex: 1,
      wordBreak: 'break-word'
    },
    removeButton: {
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      padding: '0.5rem',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '1rem',
      flexShrink: 0,
      marginLeft: '1rem'
    },
    cardBody: {
      padding: '1.5rem',
      flex: 1
    },
    infoContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    },
    infoItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.5rem 0',
      borderBottom: '1px solid #ecf0f1'
    },
    label: {
      fontWeight: 600,
      color: '#34495e',
      fontSize: '0.9rem'
    },
    value: {
      color: '#2c3e50',
      fontSize: '0.95rem',
      textAlign: 'right'
    },
    badge: {
      padding: '0.4rem 0.8rem',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: 600,
      textTransform: 'capitalize'
    },
    difficultyEasy: {
      background: '#d4edda',
      color: '#155724'
    },
    difficultyModerate: {
      background: '#fff3cd',
      color: '#856404'
    },
    difficultyHard: {
      background: '#f8d7da',
      color: '#721c24'
    },
    statusPlanned: {
      background: '#cfe2ff',
      color: '#084298'
    },
    statusInProgress: {
      background: '#fff3cd',
      color: '#856404'
    },
    statusComplete: {
      background: '#d1e7dd',
      color: '#0f5132'
    },
    bookmarkedDate: {
      background: '#f8f9fa',
      padding: '0.75rem',
      borderRadius: '6px',
      marginTop: '0.5rem',
      borderBottom: 'none'
    },
    cardFooter: {
      padding: '1rem 1.5rem',
      background: '#f8f9fa',
      borderTop: '1px solid #ecf0f1'
    },
    viewButton: {
      width: '100%',
      padding: '0.75rem',
      background: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      cursor: 'pointer',
      fontWeight: 600
    }
  };

  const getBadgeStyle = (difficulty) => {
    const lower = difficulty?.toLowerCase();
    if (lower === 'easy') return { ...styles.badge, ...styles.difficultyEasy };
    if (lower === 'moderate') return { ...styles.badge, ...styles.difficultyModerate };
    if (lower === 'hard') return { ...styles.badge, ...styles.difficultyHard };
    return styles.badge;
  };

  const getStatusBadgeStyle = (status) => {
    const lower = status?.toLowerCase().replace(' ', '-');
    if (lower === 'planned') return { ...styles.badge, ...styles.statusPlanned };
    if (lower === 'in-progress') return { ...styles.badge, ...styles.statusInProgress };
    if (lower === 'complete') return { ...styles.badge, ...styles.statusComplete };
    return styles.badge;
  };

  // Handle loading state
  if (authLoading || loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          {authLoading ? 'Checking authentication...' : 'Loading your bookmarked hikes...'}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h2>Error</h2>
          <p>{error}</p>
          <button style={styles.errorButton} onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Bookmarked Hikes</h1>
        <p style={styles.subtitle}>
          {bookmarkedHikes.length} {bookmarkedHikes.length === 1 ? 'hike' : 'hikes'} bookmarked
        </p>
      </div>

      {bookmarkedHikes.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🔖</div>
          <h2 style={styles.emptyTitle}>No bookmarks yet</h2>
          <p style={styles.emptyText}>Start exploring and bookmark your favorite hikes!</p>
          <button 
            style={styles.primaryButton}
            onClick={() => navigate('/dashboard')}
            onMouseOver={(e) => e.target.style.background = '#229954'}
            onMouseOut={(e) => e.target.style.background = '#27ae60'}
          >
            Explore Hikes
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {bookmarkedHikes.map((hike) => (
            <div 
              key={hike.hikeid} 
              style={styles.card}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>{hike.title || hike.location || 'Unnamed Hike'}</h3>
                <button
                  style={styles.removeButton}
                  onClick={() => handleRemoveBookmark(hike.hikeid)}
                  title="Remove bookmark"
                  onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                  onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                >
                  ❌
                </button>
              </div>

              <div style={styles.cardBody}>
                <div style={styles.infoContainer}>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>Location:</span>
                    <span style={styles.value}>{hike.location || 'N/A'}</span>
                  </div>

                  <div style={styles.infoItem}>
                    <span style={styles.label}>Distance:</span>
                    <span style={styles.value}>
                      {hike.distance ? `${hike.distance} miles` : 'N/A'}
                    </span>
                  </div>

                  <div style={styles.infoItem}>
                    <span style={styles.label}> Elevation:</span>
                    <span style={styles.value}>
                      {hike.elevation ? `${hike.elevation} ft` : 'N/A'}
                    </span>
                  </div>

                  <div style={styles.infoItem}>
                    <span style={styles.label}> Difficulty:</span>
                    <span style={getBadgeStyle(hike.difficulty)}>
                      {hike.difficulty || 'N/A'}
                    </span>
                  </div>

                  <div style={styles.infoItem}>
                    <span style={styles.label}> Start Date:</span>
                    <span style={styles.value}>{formatDate(hike.startdate)}</span>
                  </div>

                  <div style={styles.infoItem}>
                    <span style={styles.label}> Status:</span>
                    <span style={getStatusBadgeStyle(hike.status)}>
                      {hike.status || 'N/A'}
                    </span>
                  </div>

                  {hike.hikinggroup && (
  <div style={styles.infoItem}>
    <span style={styles.label}>👥 Group:</span>
    <span style={styles.value}>
      {console.log('Hiking group data:', hike.hikinggroup, 'Type:', typeof hike.hikinggroup)}
      {Array.isArray(hike.hikinggroup) 
        ? (hike.hikinggroup.length === 1 ? '1 person' : `${hike.hikinggroup.length} people`)
        : '1 person'
      }
    </span>
  </div>
)}

                  {hike.bookmarked_at && (
                    <div style={{ ...styles.infoItem, ...styles.bookmarkedDate }}>
                      <span style={styles.label}> Bookmarked:</span>
                      <span style={styles.value}>{formatDate(hike.bookmarked_at)}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;