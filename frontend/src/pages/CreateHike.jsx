import React, { useState, useEffect } from 'react';
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

// Mock ImageWithFallback component
const ImageWithFallback = ({ src, alt, className }) => (
  <img src={src} alt={alt} className={className} />
);

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
  const {session, currentUser} = UserAuth();

  const [error, setError] = useState("");
  const [coords, setCoords] = useState(null);

  const navigate = useNavigate();

  // Mock friends list(this is how the friends should be)
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
// Hoping that the Api for the trails would be like this

  const trails = [
    {
      id: 1,
      name: 'Half Dome Trail',
      location: 'Yosemite National Park, CA',
      distance: '16.4 miles',
      elevation: '4,800 ft',
      duration: '10-14 hours',
      difficulty: 'Expert',
      image: 'https://images.unsplash.com/photo-1688602905494-5feda601966d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3NlbWl0ZSUyMGhhbGYlMjBkb21lJTIwdHJhaWx8ZW58MXx8fHwxNzU2MzI3MDg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Iconic granite dome with cables section and panoramic views'
    },
    {
      id: 2,
      name: 'Angels Landing',
      location: 'Zion National Park, UT',
      distance: '5.4 miles',
      elevation: '1,488 ft',
      duration: '4-6 hours',
      difficulty: 'Hard',
      image: 'https://images.unsplash.com/photo-1686347858432-c385c54f9dff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmdlbHMlMjBsYW5kaW5nJTIwemlvbiUyMHRyYWlsfGVufDF8fHx8MTc1NjMyNzA5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Narrow ridge with chains and breathtaking canyon views'
    },
    {
      id: 3,
      name: 'Bright Angel Trail',
      location: 'Grand Canyon National Park, AZ',
      distance: '9.5 miles',
      elevation: '3,020 ft',
      duration: '6-9 hours',
      difficulty: 'Hard',
      image: 'https://images.unsplash.com/photo-1649786037057-8b1f92bdde95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxncmFuZCUyMGNhbnlvbiUyMGJyaWdodCUyMGFuZ2VsJTIwdHJhaWx8ZW58MXx8fHwxNzU2MzI3MDk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Well-maintained trail descending into the Grand Canyon'
    },
    {
      id: 4,
      name: 'Mount Washington',
      location: 'White Mountains, NH',
      distance: '8.5 miles',
      elevation: '4,300 ft',
      duration: '6-8 hours',
      difficulty: 'Hard',
      image: 'https://images.unsplash.com/photo-1558483754-4618fc25fe5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxhcHBhbGFjaGlhbiUyMHRyYWlsJTIwbW91bnRhaW5zfGVufDF8fHx8MTc1NjMyNzA5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Highest peak in the Northeast with extreme weather conditions'
    },
    {
      id: 5,
      name: 'Wonderland Trail',
      location: 'Mount Rainier National Park, WA',
      distance: '93 miles',
      elevation: '22,000 ft',
      duration: '10-14 days',
      difficulty: 'Expert',
      image: 'https://images.unsplash.com/photo-1572573022597-3da22e56ff39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb3VudCUyMHJhaW5pZXIlMjB3b25kZXJsYW5kJTIwdHJhaWx8ZW58MXx8fHwxNzU2MzI3MTAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Epic circumnavigation of Mount Rainier through diverse landscapes'
    },
    {
      id: 6,
      name: 'Mount Denali Base Camp',
      location: 'Denali National Park, AK',
      distance: '12.2 miles',
      elevation: '3,200 ft',
      duration: '8-10 hours',
      difficulty: 'Moderate',
      image: 'https://images.unsplash.com/photo-1648804536048-0a7d8b103bbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb3VudGFpbiUyMGhpa2luZyUyMHRyYWlsJTIwc2NlbmljfGVufDF8fHx8MTc1NjIxNjU5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Scenic approach to North Americas highest peak'
    }
  ];

  // Mock weather data based on location
  const getWeatherForLocation = (location) => {
    const weatherData = {
      'Yosemite National Park, CA': 
      {description: 'Sunny', temperature: 85, windSpeed: 5, humidity: 30 },
      
      'Zion National Park, UT':  
      { description: 'Sunny', temperature: 55, windSpeed: 8, humidity: 25 },
       
      'Grand Canyon National Park, AZ': 
      { description: 'Rainy', temperature: 23, windSpeed: 12, humidity: 85 },
       
      'White Mountains, NH': 
      { description: 'Rainy', temperature: 15, windSpeed: 15, humidity: 90 },
       
      'Mount Rainier National Park, WA': 
      { description: 'Light Rain', temperature: 5, windSpeed: 10, humidity: 95 },
      
      'Denali National Park, AK': 
      { description: 'Cloudy', temperature: 12, windSpeed: 20, humidity: 60 },
    };
    return weatherData[location] || null;
  };

  // Weather icon helper function
  const getWeatherIcon = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes('sunny')) return <Sun className="w-6 h-6 text-yellow-500" />;
    if (desc.includes('rain')) return <CloudRain className="w-6 h-6 text-blue-500" />;
    if (desc.includes('cloud')) return <Cloud className="w-6 h-6 text-gray-500" />;
    return <Sun className="w-6 h-6 text-yellow-500" />;
  };

  useEffect(() => {
    if (selectedTrail) {
      setWeather(getWeatherForLocation(selectedTrail.location));
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
  
  // Submit handler to create hike------------------------------------------------------------------------------
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
      //  use this when running locally, http://localhost:8080/newHike
      const response = await fetch('https://hiking-logbook-api.onrender.com/newHike', {
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
  // -----------------------------------------------------------------------------------------------------------------------------------------

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

/// My component

  const handleDateChange = (e) => {
    setDate(e.target.value);
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
                              {trail.duration}
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
                </div>
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
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">Distance:</span>
                          <p className="text-gray-600 dark:text-gray-400">{selectedTrail.distance}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">Elevation:</span>
                          <p className="text-gray-600 dark:text-gray-400">{selectedTrail.elevation}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">Duration:</span>
                          <p className="text-gray-600 dark:text-gray-400">{selectedTrail.duration}</p>
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