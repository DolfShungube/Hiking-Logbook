import React, { useState } from 'react';
import { 
  Mountain, 
  MapPin,
  Calendar,
  Users,
  Star,
  ArrowRight,
  Compass,
  Camera,
  Heart,
  TrendingUp,
  Clock,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PlanHikeDefault = () => {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  
  // Mock user's upcoming hikes - this would come from your API/state
  const upcomingHikes = [
    {
      id: 1,
      title: 'Half Dome Trail Adventure',
      date: '2024-12-15',
      time: '06:00',
      location: 'Yosemite National Park, CA',
      difficulty: 'Expert',
      attendees: 4,
      status: 'confirmed',
      image: 'https://images.unsplash.com/photo-1688602905494-5feda601966d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3NlbWl0ZSUyMGhhbGYlMjBkb21lJTIwdHJhaWx8ZW58MXx8fHwxNzU2MzI3MDg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 2,
      title: 'Angels Landing Challenge',
      date: '2024-12-22',
      time: '07:30',
      location: 'Zion National Park, UT',
      difficulty: 'Hard',
      attendees: 2,
      status: 'pending',
      image: 'https://images.unsplash.com/photo-1686347858432-c385c54f9dff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmdlbHMlMjBsYW5kaW5nJTIwemlvbiUyMHRyYWlsfGVufDF8fHx8MTc1NjMyNzA5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
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

  const getDaysUntil = (dateString) => {
    const today = new Date();
    const hikeDate = new Date(dateString);
    const diffTime = hikeDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return 'Past';
    return `${diffDays} days`;
  };

  const popularTrails = [
    {
      id: 1,
      name: 'Half Dome Trail',
      location: 'Yosemite National Park, CA',
      difficulty: 'Expert',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1688602905494-5feda601966d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3NlbWl0ZSUyMGhhbGYlMjBkb21lJTIwdHJhaWx8ZW58MXx8fHwxNzU2MzI3MDg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      hikers: '2.3k'
    },
    {
      id: 2,
      name: 'Angels Landing',
      location: 'Zion National Park, UT',
      difficulty: 'Hard',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1686347858432-c385c54f9dff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmdlbHMlMjBsYW5kaW5nJTIwemlvbiUyMHRyYWlsfGVufDF8fHx8MTc1NjMyNzA5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      hikers: '1.8k'
    },
    {
      id: 3,
      name: 'Mount Washington',
      location: 'White Mountains, NH',
      difficulty: 'Hard',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1558483754-4618fc25fe5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHBhbGFjaGlhbiUyMHRyYWlsJTIwbW91bnRhaW5zfGVufDF8fHx8MTc1NjMyNzA5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      hikers: '1.2k'
    }
  ];

  const planningSteps = [
    {
      icon: Mountain,
      title: "Choose Your Trail",
      description: "Browse through hundreds of curated trails from easy walks to challenging peaks"
    },
    {
      icon: Calendar,
      title: "Set Date & Time",
      description: "Pick the perfect date and starting time for your adventure"
    },
    {
      icon: Users,
      title: "Invite Friends",
      description: "Share your hiking plan and invite friends to join your journey"
    },
    {
      icon: Compass,
      title: "Start Adventure",
      description: "Get detailed directions, weather updates, and safety tips for your hike"
    }
  ];

  const stats = [
    { icon: Mountain, value: "500+", label: "Curated Trails" },
    { icon: Users, value: "10k+", label: "Happy Hikers" },
    { icon: Award, value: "4.9", label: "Average Rating" },
    { icon: Camera, value: "25k+", label: "Shared Photos" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/20 dark:bg-blue-600/20 rounded-full mb-6">
              <Mountain className="w-10 h-10 text-blue-500 dark:text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Plan Your Next Adventure
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Discover breathtaking trails, organize group hikes, and create unforgettable memories with friends. 
              Your adventure starts here!
            </p>
            <button onClick={() => navigate("/dashboard/CreateHike")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center gap-2 mx-auto">
              Start Planning Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/20 dark:bg-blue-600/20 rounded-lg mb-3">
                  <stat.icon className="w-6 h-6 text-blue-500 dark:text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Your Upcoming Hikes - Only show if user has hikes */}
        {upcomingHikes.length > 0 && (
          <div className="py-16 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Your Upcoming Hikes
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Adventures you've planned and organized
                </p>
              </div>
              <button className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 font-medium flex items-center gap-1 transition-colors">
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingHikes.map((hike) => (
                <div key={hike.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all">
                  <div className="flex">
                    <div className="w-32 h-32 flex-shrink-0">
                      <img 
                        src={hike.image} 
                        alt={hike.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                          {hike.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          hike.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                        }`}>
                          {hike.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {hike.location}
                      </p>

                      <div className="flex items-center gap-4 mb-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(hike.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(hike.time)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {hike.attendees}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-medium ${
                          getDaysUntil(hike.date) === 'Today' || getDaysUntil(hike.date) === 'Tomorrow'
                            ? 'text-orange-600 dark:text-orange-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {getDaysUntil(hike.date)}
                        </span>
                        <div className="flex gap-2">
                          <button className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 text-sm font-medium transition-colors">
                            View
                          </button>
                          <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm font-medium transition-colors">
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button onClick={() => navigate("/dashboard/CreateHike") }
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto">
                <Mountain className="w-5 h-5" />
                Plan Another Hike
              </button>
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Planning your perfect hike is simple. Follow these easy steps to create an amazing outdoor adventure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {planningSteps.map((step, index) => (
              <div 
                key={index}
                className={`relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border transition-all cursor-pointer ${
                  activeStep === index 
                    ? 'border-blue-500 shadow-lg' 
                    : 'border-gray-200 dark:border-gray-700 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-750'
                }`}
                onClick={() => setActiveStep(index)}
              >
                <div className="relative">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                    activeStep === index 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-blue-500/20 dark:bg-blue-600/20 text-blue-500 dark:text-blue-600'
                  }`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

       
       
      </div>
    </div>
  );
};

export default PlanHikeDefault;