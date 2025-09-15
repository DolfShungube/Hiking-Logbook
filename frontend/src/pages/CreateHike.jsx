import React, { useState, useEffect } from 'react';
import { createClient } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasekey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabasekey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

import { 
  Search, 
  Calendar, 
  Mountain, 
  MapPin,
  Clock,
  Users,
  UserPlus,
  X,
  Target,
  Cloud,
  Sun,
  CloudRain,
  Thermometer,
  Wind,
  Check
} from 'lucide-react';
import { UserAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getWeather } from "../../apiCalls/getWeather.js";
import { hikeDataCollection } from '../context/hikeDataContext.jsx';

// Mock ImageWithFallback component with better error handling
const ImageWithFallback = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
    // Set a default placeholder image or use a generic hiking image
    setImgSrc('https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop');
  };

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className={className}
      onError={handleError}
      style={{ objectFit: 'cover' }}
    />
  );
};

const PlanHike = () => {
  const [hikeTitle, setHikeTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [goals, setGoals] = useState('');
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [searchTrails, setSearchTrails] = useState('');
  const [invitedFriends, setInvitedFriends] = useState([]);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [selectedFriendsForInvite, setSelectedFriendsForInvite] = useState([]);
  const [weather, setWeather] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const { session, currentUser } = UserAuth();

  const [error, setError] = useState("");
  const [coords, setCoords] = useState(null);

  const navigate = useNavigate();
  const { getCoordinates } = hikeDataCollection();

  // Mock friends list
  const friendsList = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.j@email.com', avatar: 'SJ' },
    { id: 2, name: 'Mike Chen', email: 'mike.chen@email.com', avatar: 'MC' },
    { id: 3, name: 'Emily Rodriguez', email: 'emily.r@email.com', avatar: 'ER' },
    { id: 4, name: 'David Kim', email: 'david.kim@email.com', avatar: 'DK' },
    { id: 5, name: 'Jessica Brown', email: 'jess.brown@email.com', avatar: 'JB' },
    { id: 6, name: 'Alex Thompson', email: 'alex.t@email.com', avatar: 'AT' },
    { id: 7, name: 'Lisa Wang', email: 'lisa.wang@email.com', avatar: 'LW' },
    { id: 8, name: 'Ryan Connor', email: 'ryan.oc@email.com', avatar: 'RC' }
  ];

  const [trails, setTrails] = useState([]);
  const [isLoadingTrails, setIsLoadingTrails] = useState(true);

  // Function to extract coordinates from GeoJSON path
  const extractCoordinatesFromPath = (path) => {
    if (!path || !path.features || !path.features[0]) return null;
    
    try {
      const geometry = path.features[0].geometry;
      let coordinates;
      
      // Handle both MultiLineString and LineString geometries
      if (geometry.type === 'MultiLineString') {
        coordinates = geometry.coordinates[0]; // Get first line string
      } else if (geometry.type === 'LineString') {
        coordinates = geometry.coordinates;
      } else {
        return null;
      }
      
      if (coordinates && coordinates.length > 0) {
        // Return first coordinate pair [longitude, latitude]
        const firstPoint = coordinates[0];
        return {
          longitude: firstPoint[0],
          latitude: firstPoint[1],
          elevation: firstPoint[2] || null
        };
      }
    } catch (error) {
      console.error('Error extracting coordinates:', error);
    }
    return null;
  };

  // Function to calculate distance from GeoJSON path using Haversine formula
  const calculateDistanceFromPath = (path) => {
    if (!path || !path.features || !path.features[0]) return 'N/A';
    
    try {
      const geometry = path.features[0].geometry;
      let coordinates;
      
      // Handle both MultiLineString and LineString geometries
      if (geometry.type === 'MultiLineString') {
        coordinates = geometry.coordinates[0]; // Get first line string
      } else if (geometry.type === 'LineString') {
        coordinates = geometry.coordinates;
      } else {
        return 'N/A';
      }
      
      if (coordinates && coordinates.length > 1) {
        let totalDistance = 0;
        
        for (let i = 1; i < coordinates.length; i++) {
          const [lon1, lat1] = coordinates[i - 1];
          const [lon2, lat2] = coordinates[i];
          
          // Haversine formula for distance calculation
          const R = 6371; // Earth's radius in km
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLon = (lon2 - lon1) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                   Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                   Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          totalDistance += R * c;
        }
        
        return `${totalDistance.toFixed(2)} km`;
      }
    } catch (error) {
      console.error('Error calculating distance:', error);
    }
    return 'N/A';
  };

  // Function to calculate elevation gain from path
  const calculateElevationGain = (path) => {
    if (!path || !path.features || !path.features[0]) return 'N/A';
    
    try {
      const geometry = path.features[0].geometry;
      let coordinates;
      
      // Handle both MultiLineString and LineString geometries
      if (geometry.type === 'MultiLineString') {
        coordinates = geometry.coordinates[0]; // Get first line string
      } else if (geometry.type === 'LineString') {
        coordinates = geometry.coordinates;
      } else {
        return 'N/A';
      }
      
      if (coordinates && coordinates.length > 1) {
        let totalGain = 0;
        let previousElevation = coordinates[0][2] || 0;
        
        for (let i = 1; i < coordinates.length; i++) {
          const currentElevation = coordinates[i][2] || 0;
          const elevationDiff = currentElevation - previousElevation;
          
          // Only count positive elevation changes (gains)
          if (elevationDiff > 0) {
            totalGain += elevationDiff;
          }
          
          previousElevation = currentElevation;
        }
        
        return `${Math.round(totalGain)}m`;
      }
    } catch (error) {
      console.error('Error calculating elevation gain:', error);
    }
    return 'N/A';
  };

  // Updated trail fetching with better error handling
  useEffect(() => {
    const fetchTrails = async () => {
      setIsLoadingTrails(true);
      try {
        // Use get-all-routes endpoint instead of get-route
        const res = await fetch("http://localhost:8080/get-all-routes");
        const result = await res.json();
        
        if (res.ok && result.data) {
          // Process the trails data to ensure proper structure
          const processedTrails = result.data.map(trail => ({
            id: trail.routeid || trail.id,
            name: trail.name || 'Unknown Trail',
            location: trail.location || 'Unknown Location',
            difficulty: trail.difficulty || 'Easy',
            distance: calculateDistanceFromPath(trail.path),
            duration: 'N/A', // You might want to calculate this based on distance and difficulty
            elevation: calculateElevationGain(trail.path),
            description: trail.description || 'No description available',
            path: trail.path,
            image: `https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop&seed=${trail.routeid}`
          }));
          
          setTrails(processedTrails);
        } else {
          console.error("Error fetching routes:", result.error || 'Unknown error');
          setError("Failed to load trails. Please try again later.");
        }
      } catch (err) {
        console.error("Network error:", err);
        setError("Network error. Please check your connection.");
      } finally {
        setIsLoadingTrails(false);
      }
    };

    fetchTrails();
  }, []);

  //get coordinates that I will use in the get weather function
  const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (user) {
      return user.id;
    }
    if (error) {
      console.log("User with such id not found");
    }
  };

  // Updated weather function to use trail coordinates
  const getWeatherForLocation = async (trail) => {
    try {
      // First try to get coordinates from the trail's path data
      let weatherCoords = extractCoordinatesFromPath(trail.path);
      
      if (!weatherCoords) {
        // Fallback to user coordinates if trail coordinates not available
        const userid = await getCurrentUser();
        const coordsData = await getCoordinates(userid);
        if (coordsData && coordsData.length > 0) {
          weatherCoords = {
            latitude: coordsData.start[1],
            longitude: coordsData.start[0]
          };
        }
      }

      if (weatherCoords) {
        setCoords(weatherCoords);
        const weatherData = await getWeather(weatherCoords.latitude, weatherCoords.longitude);
        console.log('Weather data:', weatherData);
        console.log('Description field:', weatherData?.description);
        setWeather(weatherData);

      } else {
        setError("No coordinates found for weather data");
      }

    } catch (e) {
      setError("Error fetching weather data");
      console.log(e);
    }
  };

  // Weather icon helper function
  const getWeatherIcon = (description) => {
     console.log('getWeatherIcon called with:', description, typeof description);
    const desc = description.toLowerCase();
    if (desc.includes('sunny')) return <Sun className="w-6 h-6 text-yellow-500" />;
    if (desc.includes('rain')) return <CloudRain className="w-6 h-6 text-blue-500" />;
    if (desc.includes('cloud')) return <Cloud className="w-6 h-6 text-gray-500" />;
    return <Sun className="w-6 h-6 text-yellow-500" />;
  };

  useEffect(() => {
    if (selectedTrail) {
      getWeatherForLocation(selectedTrail);
    }
  }, [selectedTrail]);

  const filteredTrails = trails.filter(trail =>
    trail.name.toLowerCase().includes(searchTrails.toLowerCase()) ||
    trail.location.toLowerCase().includes(searchTrails.toLowerCase())
  );

  const handleTrailSelect = (trail) => {
    setSelectedTrail(trail);
    setLocation(trail.location);
    setDifficulty(trail.difficulty.toLowerCase());
    
    if (!hikeTitle) {
      setHikeTitle(`${trail.name} Adventure`);
    }
    
    // Optional: Log trail information for debugging
    console.log('Selected trail:',{
      name: trail.name,
      distance: trail.distance,
      elevation: trail.elevation,
      coordinates: extractCoordinatesFromPath(trail.path)
    });
  };

  const handleSelectFriendForInvite = (friend) => {
    if (selectedFriendsForInvite.find(f => f.id === friend.id)) {
      setSelectedFriendsForInvite(selectedFriendsForInvite.filter(f => f.id !== friend.id));
    } else {
      setSelectedFriendsForInvite([...selectedFriendsForInvite, friend]);
    }
  };

  const handleSendInvites = () => {
    const newInvites = selectedFriendsForInvite.map(friend => ({
      ...friend,
      status: 'pending',
      inviteId: Date.now() + friend.id
    }));
    
    const uniqueInvites = newInvites.filter(newInvite => 
      !invitedFriends.find(existing => existing.email === newInvite.email)
    );
    
    setInvitedFriends([...invitedFriends, ...uniqueInvites]);
    setSelectedFriendsForInvite([]);
    setShowFriendsModal(false);
  };

  const handleRemoveFriend = (friendId) => {
    setInvitedFriends(invitedFriends.filter(friend => friend.inviteId !== friendId));
  };
  
  // Submit handler to create hike
  const handleCreateHike = async () => {
    if (!currentUser || !selectedTrail || !date || !time || !hikeTitle.trim()) {
      setSubmitMessage('Please fill in all required fields and ensure you are logged in');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('Creating your hike plan...');

    try {
      const hikingGroup = {
        members: invitedFriends.map(friend => friend.id)
      };

      const response = await fetch('http://localhost:8080/newHike', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userid: currentUser.id,
          startdate: date,
          enddate: date,
          location,
          weather,
          elevation: selectedTrail?.elevation || null,
          status: "planned",
          distance: selectedTrail?.distance || null,
          hikinggroup: hikingGroup,
          difficulty,
          title: hikeTitle,
          route: selectedTrail?.id || null // Add route reference
        })
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage(`Hike plan created successfully!`);
        setTimeout(() => {
          navigate('/dashboard/Calendar', { 
            state: { 
              hikeData: {
                title: hikeTitle,
                date,
                time,
                location,
                difficulty,
                trail: selectedTrail,
                invitedFriends,
                weather,
                goals
              }
            }
          });
        }, 1500);
      } else {
        setSubmitMessage(`Error: ${result.error || 'Failed to create hike plan'}`);
      }
    } catch (error) {
      console.error('Error creating hike:', error);
      setSubmitMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form function
  const resetForm = () => {
    setHikeTitle('');
    setDate('');
    setTime('');
    setLocation('');
    setDifficulty('');
    setGoals('');
    setSelectedTrail(null);
    setSearchTrails('');
    setInvitedFriends([]);
    setWeather(null);
    setSubmitMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            Plan Your Hike <Mountain className="w-8 h-8" />
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Create an amazing hiking adventure with your friends</p>
          {currentUser && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Planning as: {currentUser.email}
            </p>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Hike Details Form */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Hike Details
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label htmlFor="hike-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hike Title *
                  </label>
                  <input
                    id="hike-title"
                    type="text"
                    placeholder="e.g., Mount Denali Adventure"
                    value={hikeTitle}
                    onChange={(e) => setHikeTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date *
                    </label>
                    <input
                      id="date"
                      type="date"
                      value={date}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Time *
                    </label>
                    <input
                      id="time"
                      type="time"
                      value={time}
                      min="06:00"
                      max="18:00"
                      step="900"
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    placeholder="e.g., Mount Denali, Alaska"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="moderate">Moderate</option>
                    <option value="hard">Hard</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="goals" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    Hiking Goals
                  </label>
                  <textarea
                    id="goals"
                    placeholder="e.g., Improve fitness, reach summit before sunset, practice navigation skills, team building..."
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Invite Friends Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Invite Friends
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <button
                  onClick={() => setShowFriendsModal(true)}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center gap-2 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Invite Friends
                </button>

                {invitedFriends.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Invited Friends ({invitedFriends.length})</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {invitedFriends.map((friend) => (
                        <div
                          key={friend.inviteId}
                          className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {friend.avatar || friend.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{friend.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{friend.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 rounded-full">
                              {friend.status}
                            </span>
                            <button
                              onClick={() => handleRemoveFriend(friend.inviteId)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Trail Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Mountain className="w-5 h-5" />
                  Select Trail *
                </h3>
              </div>
              <div className="p-6">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search trails by name or location..."
                    value={searchTrails}
                    onChange={(e) => setSearchTrails(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {isLoadingTrails ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Loading trails...</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {filteredTrails.map((trail) => (
                      <div
                        key={trail.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          selectedTrail?.id === trail.id 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 dark:border-gray-600'
                        }`}
                        onClick={() => handleTrailSelect(trail)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{trail.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {trail.location}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Mountain className="w-3 h-3" />
                                {trail.distance}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {trail.elevation}
                              </span>
                            </div>
                          </div>
                          <span 
                            className={`px-2 py-1 rounded-full text-xs font-medium
                              ${trail.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                              ${trail.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : ''}
                              ${trail.difficulty === 'Hard' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' : ''}
                              ${trail.difficulty === 'Expert' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : ''}
                            `}
                          >
                            {trail.difficulty}
                          </span>
                        </div>
                      </div>
                    ))}
                    {filteredTrails.length === 0 && !isLoadingTrails && (
                      <div className="text-center py-8">
                        <Mountain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">No trails found matching your search</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
             {/* Weather Information Card */}
            {weather && selectedTrail && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    {getWeatherIcon(weather.description)}
                    Weather Forecast
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getWeatherIcon(weather.description)}
                        <div>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">{weather.description}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{selectedTrail.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{weather.temperature}°C</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <Wind className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Wind Speed</p>
                          <p className="font-medium text-gray-900 dark:text-white">{weather.windSpeed || 'N/A'} km/h</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Cloud className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Humidity</p>
                          <p className="font-medium text-gray-900 dark:text-white">{weather.humidity || 'N/A'}%</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Weather-based recommendations */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Weather Recommendations</h4>
                      <div className="space-y-1">
                        {weather.description.toLowerCase().includes('rain') && (
                          <p className="text-sm text-amber-600 dark:text-amber-400">⚠️ Bring waterproof gear and check trail conditions</p>
                        )}
                        {weather.temperature < 10 && (
                          <p className="text-sm text-blue-600 dark:text-blue-400">🧥 Pack warm layers for cold conditions</p>
                        )}
                        {weather.temperature > 25 && (
                          <p className="text-sm text-red-600 dark:text-red-400">☀️ Bring plenty of water and sun protection</p>
                        )}
                        {(weather.windSpeed || 0) > 15 && (
                          <p className="text-sm text-purple-600 dark:text-purple-400">💨 Expect strong winds, secure loose items</p>
                        )}
                        {weather.description.toLowerCase().includes('sunny') && (
                          <p className="text-sm text-green-600 dark:text-green-400">✅ Perfect weather for hiking!</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Trail Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trail Preview</h3>
              </div>
              <div className="p-6">
                {selectedTrail ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <ImageWithFallback
                        src={selectedTrail.image}
                        alt={`${selectedTrail.name} trail`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <span 
                        className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium text-white
                          ${selectedTrail.difficulty === 'Easy' ? 'bg-green-500' :
                          selectedTrail.difficulty === 'Moderate' ? 'bg-yellow-500' :
                          selectedTrail.difficulty === 'Hard' ? 'bg-orange-500' :
                          'bg-red-500'}
                        `}
                      >
                        {selectedTrail.difficulty}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{selectedTrail.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {selectedTrail.location}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{selectedTrail.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">Distance:</span>
                          <p className="text-gray-600 dark:text-gray-400">{selectedTrail.distance}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">Elevation:</span>
                          <p className="text-gray-600 dark:text-gray-400">{selectedTrail.elevation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Mountain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Select a trail to see preview</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {submitMessage && (
                <div className={`p-3 rounded-md text-sm ${
                  submitMessage.includes('Error') || submitMessage.includes('Please') || submitMessage.includes('Network')
                    ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                    : submitMessage.includes('Creating')
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
                    : 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                }`}>
                  {submitMessage}
                </div>
              )}
              <div className="flex gap-3">
                <button 
                  onClick={handleCreateHike}
                  disabled={!selectedTrail || !date || !time || !hikeTitle.trim() || isSubmitting || !currentUser}
                  className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                    !selectedTrail || !date || !time || !hikeTitle.trim() || isSubmitting || !currentUser
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isSubmitting ? 'Creating...' : 'Create Hike Plan'}
                </button>
                <button 
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear Form
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Friends Invitation Modal */}
        {showFriendsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-96 overflow-hidden">
              <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Select Friends to Invite
                  </h3>
                  <button
                    onClick={() => {
                      setShowFriendsModal(false);
                      setSelectedFriendsForInvite([]);
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-3 max-h-64 overflow-y-auto">
                {friendsList.map((friend) => {
                  const isSelected = selectedFriendsForInvite.find(f => f.id === friend.id);
                  const isAlreadyInvited = invitedFriends.find(f => f.email === friend.email);
                  
                  return (
                    <div
                      key={friend.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        isAlreadyInvited 
                          ? 'border-gray-200 bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-50'
                          : isSelected
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100'
                            : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => !isAlreadyInvited && handleSelectFriendForInvite(friend)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {friend.avatar}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{friend.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{friend.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {isAlreadyInvited ? (
                            <span className="text-xs px-2 py-1 bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-400 rounded-full">
                              Invited
                            </span>
                          ) : isSelected ? (
                            <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="p-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowFriendsModal(false);
                      setSelectedFriendsForInvite([]);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendInvites}
                    disabled={selectedFriendsForInvite.length === 0}
                    className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                      selectedFriendsForInvite.length === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    Invite {selectedFriendsForInvite.length > 0 ? `${selectedFriendsForInvite.length} Friend${selectedFriendsForInvite.length > 1 ? 's' : ''}` : 'Friends'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanHike;