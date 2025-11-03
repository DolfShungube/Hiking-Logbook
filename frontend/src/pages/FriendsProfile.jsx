import React, { useState, useEffect } from 'react';
import { Settings, MapPin, Mountain, Clock, TrendingUp, Award, Calendar, Footprints, Target, Trophy, Star, Crown, Compass, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { UserAuth } from "../context/AuthContext.jsx";
import { UserDataCollection } from "../context/UsersContext.jsx";
import { hikeDataCollection } from '../context/hikeDataContext';
import defaultUserProfile from "../assets/profile.jpg"
import RecentHikes from '../components/RecentHikesProfile.jsx';

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Format join date
const formatJoinDate = (dateString) => {
  if (!dateString) return 'Recently';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

// Utility function to parse duration string (e.g., "5h 15m" or "2h 30m")
const parseDuration = (durationStr) => {
  if (!durationStr || durationStr === "5h 15m") return 0; // Skip default placeholder values
  
  let totalHours = 0;
  const hourMatch = durationStr.match(/(\d+)h/);
  const minMatch = durationStr.match(/(\d+)m/);
  
  if (hourMatch) totalHours += parseInt(hourMatch[1]);
  if (minMatch) totalHours += parseInt(minMatch[1]) / 60;
  
  return totalHours;
};

// Utility function to parse elevation from string or number
const parseElevation = (elevation) => {
  if (!elevation) return 0;
  
  // If it's already a number
  if (typeof elevation === 'number') return elevation;
  
  // If it's a string like "4,342 ft" or "650 ft"
  if (typeof elevation === 'string') {
    const numStr = elevation.replace(/[^\d]/g, '');
    return parseInt(numStr) || 0;
  }
  
  return 0;
};

// Calculate stats from hikes data
const calculateStats = (hikes) => {
  if (!hikes || hikes.length === 0) {
    return {
      totalHikes: 0,
      totalMiles: 0,
      totalElevation: 0,
      totalHours: 0,
      easyHikes: 0,
      moderateHikes: 0,
      hardHikes: 0
    };
  }

  let totalMiles = 0;
  let totalElevation = 0;
  let totalHours = 0;
  let easyHikes = 0;
  let moderateHikes = 0;
  let hardHikes = 0;

  hikes.forEach((hike, index) => {
    // Sum distances (assuming distance is in km)
    const distance = parseFloat(hike.distance) || 0;
    totalMiles += distance;

    // Sum elevations - try different possible field names
    const elevation = hike.elevation || hike.elevationGain || hike.elevation_gain || 0;
    if (elevation) {
      totalElevation += parseElevation(elevation);
    }

    // Sum durations - try different possible field names
    const duration = hike.duration || hike.time || hike.hikingTime || null;
    if (duration && duration !== "5h 15m") {
      totalHours += parseDuration(duration);
    }

    // Count by difficulty - try different formats and field names
    const difficultyRaw = hike.difficulty || hike.difficultyLevel || hike.difficulty_level || '';
    const difficulty = difficultyRaw.toString().toLowerCase().trim();
    
    if (difficulty === 'easy' || difficulty === '1' || difficulty === 'beginner') {
      easyHikes++;
    } else if (difficulty === 'moderate' || difficulty === '2' || difficulty === 'intermediate') {
      moderateHikes++;
    } else if (difficulty === 'hard' || difficulty === 'difficult' || difficulty === '3' || difficulty === 'advanced') {
      hardHikes++;
    }
  });

  const stats = {
    totalHikes: hikes.length,
    totalMiles: Math.round(totalMiles),
    totalElevation: Math.round(totalElevation),
    totalHours: Math.round(totalHours),
    easyHikes,
    moderateHikes,
    hardHikes
  };
  
  return stats;
};

// ============================================
// UI COMPONENTS
// ============================================

// Avatar Component
const Avatar = ({ src, fallback, className }) => (
  <div className={`relative rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 ring-4 ring-white shadow-lg ${className}`}>
    {src ? (
      <img src={src} alt="Avatar" className="w-full h-full object-cover" />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-blue-600 font-bold text-2xl">
        {fallback}
      </div>
    )}
  </div>
);

// Card Components
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={`p-6 pb-4 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-bold text-gray-900 ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`px-6 pb-6 ${className}`}>{children}</div>
);

// Button Component
const Button = ({ children, className = '', onClick, variant = 'primary' }) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    ghost: 'hover:bg-gray-100 text-gray-700',
  };
  
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Image with Fallback
const ImageWithFallback = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  
  if (error) {
    return (
      <div className={`bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${className}`}>
        <Mountain className="h-8 w-8 text-gray-400" />
      </div>
    );
  }
  
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
};

// Stats Card Component
const HikingStatsCard = ({ title, value, subtitle, icon, loading }) => (
  <Card className="hover:scale-105 transition-transform duration-200">
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {loading ? (
            <div className="h-9 w-24 bg-gray-200 animate-pulse rounded mt-2"></div>
          ) : (
            <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {value}
            </p>
          )}
          <p className="text-xs text-gray-600 mt-2">{subtitle}</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

// Profile Stats Component
const ProfileStats = ({ totalHikes, easyHikes, moderateHikes, hardHikes, loading }) => (
  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Hiking Summary</p>
          {loading ? (
            <div className="h-12 w-40 bg-gray-200 animate-pulse rounded mt-2"></div>
          ) : (
            <p className="text-4xl font-bold mt-2 text-gray-900">
              {totalHikes} <span className="text-xl text-gray-600">Total Hikes</span>
            </p>
          )}
        </div>
        <div className="flex gap-8 text-sm">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
              {loading ? (
                <div className="w-6 h-6 bg-green-200 animate-pulse rounded"></div>
              ) : (
                <p className="font-bold text-green-700 text-lg">{easyHikes}</p>
              )}
            </div>
            <p className="text-gray-600 font-medium">Easy</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
              {loading ? (
                <div className="w-6 h-6 bg-yellow-200 animate-pulse rounded"></div>
              ) : (
                <p className="font-bold text-yellow-700 text-lg">{moderateHikes}</p>
              )}
            </div>
            <p className="text-gray-600 font-medium">Moderate</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
              {loading ? (
                <div className="w-6 h-6 bg-red-200 animate-pulse rounded"></div>
              ) : (
                <p className="font-bold text-red-700 text-lg">{hardHikes}</p>
              )}
            </div>
            <p className="text-gray-600 font-medium">Hard</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Achievement Badge Component
const AchievementBadge = ({ title, description, icon, earned, earnedDate }) => (
  <Card className={`${earned ? 'bg-gradient-to-br from-green-50 to-blue-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-70'} hover:scale-105 transition-all duration-200`}>
    <CardContent className="pt-6">
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${earned ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg' : 'bg-gray-300 text-gray-500'}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600 mt-1.5">{description}</p>
          {earned && earnedDate && (
            <div className="flex items-center gap-1.5 mt-2">
              <Award className="h-3.5 w-3.5 text-green-600" />
              <p className="text-xs text-green-600 font-semibold">Earned {earnedDate}</p>
            </div>
          )}
          {!earned && (
            <p className="text-xs text-gray-400 mt-2 font-medium">🔒 Locked</p>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

// Tabs Component
const Tabs = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className="space-y-6">
      {React.Children.map(children, child => {
        if (child.type === TabsList) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        if (child.type === TabsContent) {
          return React.cloneElement(child, { activeTab });
        }
        return child;
      })}
    </div>
  );
};

const TabsList = ({ children, activeTab, setActiveTab }) => (
  <div className="inline-flex bg-gray-100 p-1.5 rounded-xl shadow-sm">
    {React.Children.map(children, child =>
      React.cloneElement(child, { activeTab, setActiveTab })
    )}
  </div>
);

const TabsTrigger = ({ value, children, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(value)}
    className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
      activeTab === value
        ? 'bg-blue-600 text-white shadow-md'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
    }`}
  >
    {children}
  </button>
);

const TabsContent = ({ value, children, activeTab }) => {
  if (value !== activeTab) return null;
  return <div className="animate-in fade-in duration-300">{children}</div>;
};

// ============================================
// MAIN PROFILE PAGE COMPONENT
// ============================================

const FriendsProfilePage = () => {
  const { session, currentUser } = UserAuth();
  const { getUser } = UserDataCollection();
  const { getCompletedHikesData } = hikeDataCollection();
  const navigate = useNavigate();
  const { friendId } = useParams(); // Get friend ID from URL
  
  // State for friend data
  const [friendData, setFriendData] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  
  // State for hikes data and statistics
  const [completedHikes, setCompletedHikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalHikes: 0,
    totalMiles: 0,
    totalElevation: 0,
    totalHours: 0,
    easyHikes: 0,
    moderateHikes: 0,
    hardHikes: 0
  });

  // Determine which user's profile to show
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        let userToShow;
        
        // If friendId exists, fetch friend's data; otherwise use current user
        if (friendId && friendId !== currentUser?.id) {
          const friendInfo = await getUser(friendId);
          userToShow = friendInfo;
          setIsOwnProfile(false);
        } else {
          userToShow = currentUser;
          setIsOwnProfile(true);
        }
        
        setFriendData(userToShow);
        
        // Fetch hikes for the user being viewed
        const userId = friendId || currentUser?.id;
        if (userId) {
          const data = await getCompletedHikesData(userId);
          const hikes = data?.data || [];
          
          setCompletedHikes(hikes);
          
          // Calculate statistics from fetched hikes
          const calculatedStats = calculateStats(hikes);
          setStats(calculatedStats);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      loadUserData();
    }
  }, [friendId, currentUser?.id]);

  // Create user object from friend or current user data
  const user = friendData ? {
    name: friendData.userName || friendData.full_name || friendData.firstname || 'User',
    username: friendData.email || '',
    location: "South Africa, Johannesburg",
    bio: friendData.bio || "Adventure seeker exploring trails. Nature photographer and weekend warrior.",
    joinedDate: formatJoinDate(friendData.createdAt),
    avatar: friendData.picture || defaultUserProfile,
  } : null;

  // Update stats array to use calculated values
  const statsCards = [
    {
      title: "Total Hikes",
      value: stats.totalHikes,
      subtitle: "Completed adventures",
      icon: <Footprints className="h-5 w-5" />,
    },
    {
      title: "Kilometers Hiked",
      value: stats.totalMiles.toLocaleString(),
      subtitle: "Distance covered",
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      title: "Elevation Gained",
      value: stats.totalElevation > 0 ? `${stats.totalElevation.toLocaleString()} m` : "N/A",
      subtitle: stats.totalElevation > 0 ? "Total ascent" : "No data yet",
      icon: <Mountain className="h-5 w-5" />,
    },
    
  ];

  // Update achievements to use real stats
  const achievements = [
    {
      title: "First Steps",
      description: "Complete your first hike",
      icon: <Footprints className="h-7 w-7" />,
      earned: stats.totalHikes >= 1,
      earnedDate: stats.totalHikes >= 1 ? "Achieved" : null,
    },
    {
      title: "Explorer",
      description: "Complete 10 hikes",
      icon: <Compass className="h-7 w-7" />,
      earned: stats.totalHikes >= 10,
      earnedDate: stats.totalHikes >= 10 ? "Achieved" : null,
    },
    {
      title: "Peak Bagger",
      description: "Complete 25 hard hikes",
      icon: <Mountain className="h-7 w-7" />,
      earned: stats.hardHikes >= 25,
      earnedDate: stats.hardHikes >= 25 ? "Achieved" : null,
    },
    {
      title: "Century Club",
      description: "Complete 100 hikes",
      icon: <Trophy className="h-7 w-7" />,
      earned: stats.totalHikes >= 100,
      earnedDate: stats.totalHikes >= 100 ? "Achieved" : null,
    },
    {
      title: "Marathon Walker",
      description: "Hike 1,000+ miles",
      icon: <Target className="h-7 w-7" />,
      earned: stats.totalMiles >= 1000,
      earnedDate: stats.totalMiles >= 1000 ? "Achieved" : null,
    },
    {
      title: "High Altitude Hero",
      description: "Gain 50,000 ft elevation",
      icon: <Crown className="h-7 w-7" />,
      earned: stats.totalElevation >= 50000,
      earnedDate: stats.totalElevation >= 50000 ? "Achieved" : null,
    },
  ];

  const photos = [
    "https://images.unsplash.com/photo-1623622863859-2931a6c3bc80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    "https://images.unsplash.com/photo-1538422314488-83e8e11d298c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    "https://images.unsplash.com/photo-1663616146260-c8cec1a9a238?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    "https://images.unsplash.com/photo-1662802416285-91ace09ed630?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
  ];

  // Show loading state
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6 gap-2 flex items-center"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <Avatar src={user.avatar} fallback={user.name.charAt(0)} className="h-28 w-28" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-blue-600 font-semibold mt-1">{user.username}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">{user.location}</span>
                </div>
                <p className="mt-3 text-sm text-gray-700 max-w-md leading-relaxed">{user.bio}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Joined {user.joinedDate}</span>
                </div>
              </div>
            </div>
            {isOwnProfile}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              <ProfileStats 
                totalHikes={stats.totalHikes} 
                easyHikes={stats.easyHikes} 
                moderateHikes={stats.moderateHikes} 
                hardHikes={stats.hardHikes}
                loading={loading}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {statsCards.map((stat, index) => (
                  <HikingStatsCard key={index} {...stat} loading={loading} />
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Hikes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="[&>div]:!grid-cols-1 [&>div]:!gap-3">
                      <RecentHikes type="complete" userId={friendId || currentUser?.id} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Latest Achievements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {achievements
                      .filter(a => a.earned)
                      .slice(0, 3)
                      .map((achievement, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all cursor-pointer group">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-shadow">
                            {achievement.icon}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-900">{achievement.title}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {achievement.earnedDate}
                            </p>
                          </div>
                          <Award className="h-5 w-5 text-green-600" />
                        </div>
                      ))}
                    {achievements.filter(a => a.earned).length === 0 && (
                      <p className="text-gray-500 text-center py-4">No achievements yet. Keep hiking!</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {achievements.map((achievement, index) => (
                <AchievementBadge key={index} {...achievement} />
              ))}
            </div>
          </TabsContent>

          
        </Tabs>
      </div>
    </div>
  );
};

export default FriendsProfilePage;
