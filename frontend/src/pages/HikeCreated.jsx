import React, { useState } from 'react';
import { 
  CheckCircle, 
  Calendar, 
  Mountain, 
  MapPin,
  Clock,
  Users,
  Share2,
  Edit,
  Trash2,
  Copy,
  MessageCircle,
  Heart,
  Star,
  Navigation,
  Thermometer,
  CloudRain
} from 'lucide-react';

// Mock data for the created hike




const weatherData = {
  temperature: "72°F",
  condition: "Partly Cloudy",
  humidity: "45%",
  windSpeed: "8 mph"
};

const HikeCreatedPage = () => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://hikeapp.com/hike/${hikeData.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Hike Created Successfully! 🎉
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your hiking adventure has been planned. Time to invite your friends!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hike Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="relative">
                <img 
                  src={hikeData.trail.image} 
                  alt={hikeData.trail.name}
                  className="w-full h-64 object-cover rounded-t-xl"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
                    {hikeData.difficulty}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="p-2 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/30 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button 
                    className="p-2 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/30 transition-colors"
                    onClick={() => setShowShareModal(true)}
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {hikeData.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {hikeData.location}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {formatDate(hikeData.date)}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Clock className="w-5 h-5 text-green-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Time</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {formatTime(hikeData.time)}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Mountain className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Distance</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {hikeData.trail.distance}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Navigation className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Elevation</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {hikeData.trail.elevation}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {hikeData.description}
                  </p>
                </div>

                <div className="flex gap-3 mt-6">
                  <button className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2">
                    <Users className="w-4 h-4" />
                    Invite Friends
                  </button>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Discussion
                </h3>
              </div>
              <div className="p-6">
                <div className="flex gap-3">
                  <img 
                    src="https://i.pravatar.cc/100?img=1" 
                    alt="Your avatar" 
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <textarea 
                      placeholder="Share your thoughts about this hike..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={3}
                    />
                    <button className="mt-2 bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition-colors text-sm">
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weather Forecast */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <CloudRain className="w-5 h-5" />
                  Weather Forecast
                </h3>
              </div>
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {weatherData.temperature}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{weatherData.condition}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Humidity</span>
                    <span className="text-gray-900 dark:text-white">{weatherData.humidity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Wind Speed</span>
                    <span className="text-gray-900 dark:text-white">{weatherData.windSpeed}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Invited Friends */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Invited Friends ({invitedFriends.length})
                </h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {invitedFriends.map((friend) => (
                  <div key={friend.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={friend.avatar} 
                        alt={friend.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {friend.name}
                      </span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      friend.status === 'Accepted' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {friend.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-3">
                <button 
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                  onClick={handleCopyLink}
                >
                  <Copy className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {copied ? 'Link Copied!' : 'Copy Hike Link'}
                  </span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-700 dark:text-gray-300">Add to Favorites</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3 text-red-600 dark:text-red-400">
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Hike</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Share Hike</h3>
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Share Link:</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={`https://hikeapp.com/hike/${hikeData.id}`}
                      readOnly
                      className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <button 
                      onClick={handleCopyLink}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HikeCreatedPage;