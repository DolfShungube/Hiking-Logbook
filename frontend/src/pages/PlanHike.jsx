import React, { useState, useEffect } from 'react';
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
  Award,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Gauge,
  MountainIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const PlanHikeDefault = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [hikes, setHikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingHikeId, setDeletingHikeId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hikeToDelete, setHikeToDelete] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = UserAuth();
  
  // Fetch hikes from your API
  useEffect(() => {
    const fetchHikes = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if user is authenticated
        if (!currentUser?.id) {
          setError("Please log in to view your hikes.");
          return;
        }

        // Updated API call to match your server endpoint  , run locally: http://localhost:8080/planned-hikes?userid=${currentUser.id}
        const response = await fetch(`https://hiking-logbook-api.onrender.com/planned-hikes?userid=${currentUser.id}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        
        // Your API returns { message: "...", data: [...] }
        // So we need to access result.data instead of just result
        setHikes(result.data || []); 
        
      } catch (err) {
        console.error("Error fetching hikes:", err);
        setError("Failed to load hikes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if currentUser is available
    if (currentUser?.id) {
      fetchHikes();
    } else {
      setLoading(false);
      setError("Please log in to view your hikes.");
    }
  }, [currentUser]);

  const formatDate = (dateString) => {
    if (!dateString) return 'No date set';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return 'No time set';
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.log('Time formatting error for:', dateTimeString, error);
      return 'Invalid time';
    }
  };

  const formatDistance = (distance) => {
    if (!distance) return 'N/A';
    return `${distance} km`;
  };

  const formatElevation = (elevation) => {
    if (!elevation) return 'N/A';
    return `${elevation} km`;
  };

  const getDaysUntil = (dateString) => {
    if (!dateString) return 'No date';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    const hikeDate = new Date(dateString);
    hikeDate.setHours(0, 0, 0, 0); // Reset time to start of day
    
    const diffTime = hikeDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return 'Past';
    return `${diffDays} days`;
  };

  // Helper function to extract date from timestamp
  const extractDateFromTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toISOString().split('T')[0]; 
  };

  // Helper function to extract time from timestamp
  const extractTimeFromTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toTimeString().slice(0, 5);
  };

  // Helper function to combine date and time into timestamp
  const combineDateTime = (dateStr, timeStr, originalTimestamp) => {
    // Start with current date/time if no original timestamp
    const baseDate = originalTimestamp ? new Date(originalTimestamp) : new Date();
    
    //new date, update it
    if (dateStr) {
      const [year, month, day] = dateStr.split('-');
      baseDate.setFullYear(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    
    // new time, update it
    if (timeStr) {
      const [hours, minutes] = timeStr.split(':');
      baseDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    }
    
    return baseDate.toISOString();
  };

  const handleViewHike = (hike) => {
    // Show hike details in a modal instead of navigating
    setSelectedHike(hike);
    setShowHikeModal(true);
    setActiveDropdown(null);
  };

  const handleEditHike = (hike) => {
    setEditingHike(hike);
  
    setEditFormData({
      title: hike.title || '',
      location: hike.location || '',
      date: hike.startdate ? extractDateFromTimestamp(hike.startdate) : '',
      time: hike.startdate ? extractTimeFromTimestamp(hike.startdate) : '',
      difficulty: hike.difficulty || 'easy',
      status: hike.status || 'planned',
      distance: hike.distance?.toString() || '',
      elevation: hike.elevation?.toString() || ''
    });
  
    setShowEditModal(true);
  };

  const handleDeleteHike = async (hikeId) => {
    try {
      setDeletingHikeId(hikeId);
      /// run locally http://localhost:8080/planned-hikes/${hikeId}
      const response = await fetch(`https://hiking-logbook-api.onrender.com/planned-hikes/${hikeId}/${currentUser.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete hike: ${response.status}`);
      }

      // Remove the hike from the local state
      setHikes(hikes.filter(hike => hike.id !== hikeId));
      setShowDeleteModal(false);
      setHikeToDelete(null);
      
    } catch (err) {
      console.error("Error deleting hike:", err);
      setError("Failed to delete hike. Please try again.");
    } finally {
      setDeletingHikeId(null);
      setActiveDropdown(null);
    }
  };

  const handleSaveEdit = async () => {
    try {
      setSavingEdit(true);
      
      const hikeId = editingHike.hikeid || editingHike.id;
      
      if (!hikeId) {
        console.error('No hike ID found:', editingHike);
        throw new Error('Hike ID not found');
      }
  
      console.log('Saving edit for hike ID:', hikeId);
      console.log('Edit form data:', editFormData);
  
      // Combine date and time into proper timestamp for startdate
      const newStartDate = combineDateTime(
        editFormData.date, 
        editFormData.time, 
        editingHike.startdate
      );
  
      // when running locally:  http://localhost:8080/planned-hikes/${editingHike.id}
      const response = await fetch(`https://hiking-logbook-api.onrender.com/planned-hikes/${editingHike.id}/${currentUser.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editFormData.title,
          location: editFormData.location,
          startdate: newStartDate,
          difficulty: editFormData.difficulty,
          distance: parseFloat(editFormData.distance) || editingHike.distance,
          elevation: parseFloat(editFormData.elevation) || editingHike.elevation,
          status: editFormData.status
        })
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error(`Failed to update hike: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Update successful:', result);
      
      setHikes(prevHikes =>
        prevHikes.map(hike => {
          const currentHikeId = hike.hikeid || hike.id;
          return currentHikeId === hikeId
            ? { 
                ...hike, 
                title: editFormData.title,
                location: editFormData.location,
                startdate: newStartDate, 
                difficulty: editFormData.difficulty,
                distance: parseFloat(editFormData.distance) || hike.distance,
                elevation: parseFloat(editFormData.elevation) || hike.elevation,
                status: editFormData.status
              }
            : hike
        })
      );
  
      setShowEditModal(false);
      setEditingHike(null);
      //setEditFormData({});
      
    } catch (err) {
      console.error("Error updating hike:", err);
      setError("Failed to update hike. Please try again.");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleEditInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const confirmDeleteHike = (hike) => {
    setHikeToDelete(hike);
    setShowDeleteModal(true);
    setActiveDropdown(null);
  };

  const [showAllHikes, setShowAllHikes] = useState(false);
  const [selectedHike, setSelectedHike] = useState(null);
  const [showHikeModal, setShowHikeModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingHike, setEditingHike] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [savingEdit, setSavingEdit] = useState(false);

  const handleViewAllHikes = () => {
    setShowAllHikes(!showAllHikes);
  };

  const toggleDropdown = (hikeId, e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === hikeId ? null : hikeId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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

  // Edit hike modal
  const EditHikeModal = () => (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${showEditModal ? 'block' : 'hidden'}`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        {editingHike && (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Edit Hike
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="w-8 h-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
  
            {/* Form */}
            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hike Title
                </label>
                <input
  type="text"
  value={editFormData.title}
  onChange={(e) => handleEditInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter hike title"
                  autoComplete="off"
                />
              </div>
  
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
  type="text"
  value={editFormData.location}
  onChange={(e) => handleEditInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter location"
                  autoComplete="off"
                />
              </div>
  
              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={editFormData.date || ''}
                    onChange={(e) => handleEditInputChange('date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={editFormData.time || ''}
                    onChange={(e) => handleEditInputChange('time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
  
              {/* Distance and Elevation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Distance (km)
                  </label>
                  <input
                    type="number"
                    step="1.0"
                    min="0"
                    value={editFormData.distance || ''}
                    onChange={(e) => handleEditInputChange('distance', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter distance"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Elevation Gain (m)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={editFormData.elevation || ''}
                    onChange={(e) => handleEditInputChange('elevation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter elevation gain"
                  />
                </div>
              </div>
  
              {/* Status and Difficulty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={editFormData.status || 'planned'}
                    onChange={(e) => handleEditInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="planned">Planned</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={editFormData.difficulty || 'easy'}
                    onChange={(e) => handleEditInputChange('difficulty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="easy">Easy</option>
                    <option value="moderate">Moderate</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>
  
            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={savingEdit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {savingEdit ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  // Hike details modal
  const HikeDetailsModal = () => (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${showHikeModal ? 'block' : 'hidden'}`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        {selectedHike && (
          <>
            {/* Header */}
            <div className="relative">
              <img 
                src={selectedHike.image} 
                alt={selectedHike.title}
                className="w-full h-48 object-cover rounded-t-xl"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1648804536048-0a7d8b103bbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb3VudGFpbiUyMGhpa2luZyUyMHRyYWlsJTIwc2NlbmljfGVufDF8fHx8MTc1NjIxNjU5Nnww&ixlib=rb-4.1.0&q=80&w=1080';
                }}
              />
              <button
                onClick={() => setShowHikeModal(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
              >
                ×
              </button>
              <div className="absolute bottom-4 left-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedHike.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800'
                    : selectedHike.status === 'planned'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {selectedHike.status}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {selectedHike.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-5 h-5" />
                  <span>{selectedHike.location}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDate(selectedHike.startdate)}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Clock className="w-5 h-5" />
                  <span>{formatTime(selectedHike.startdate)}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Users className="w-5 h-5" />
                  <span>{selectedHike.attendees || 1} attendees</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Gauge className="w-5 h-5" />
                  <span>{formatDistance(selectedHike.distance)}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <MountainIcon className="w-5 h-5" />
                  <span>{formatElevation(selectedHike.elevation)}</span>
                </div>
              </div>

              {selectedHike.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedHike.description}</p>
                </div>
              )}

              {selectedHike.difficulty && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Difficulty</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedHike.difficulty === 'easy' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : selectedHike.difficulty === 'moderate'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {selectedHike.difficulty}
                  </span>
                </div>
              )}

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <div className="text-center">
                  <span className={`text-2xl font-bold ${
                    getDaysUntil(selectedHike.startdate) === 'Today' || getDaysUntil(selectedHike.startdate) === 'Tomorrow'
                      ? 'text-orange-600 dark:text-orange-400'
                      : getDaysUntil(selectedHike.startdate) === 'Past'
                      ? 'text-gray-400 dark:text-gray-500'
                      : 'text-blue-600 dark:text-blue-400'
                  }`}>
                    {getDaysUntil(selectedHike.startdate)}
                  </span>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {getDaysUntil(selectedHike.startdate) === 'Past' ? 'This hike has passed' : 'until your hike'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowHikeModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowHikeModal(false);
                    handleEditHike(selectedHike);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Hike
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  // Delete confirmation modal
  const DeleteConfirmationModal = () => (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${showDeleteModal ? 'block' : 'hidden'}`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Delete Hike
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete "{hikeToDelete?.title}"? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setHikeToDelete(null);
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDeleteHike(hikeToDelete.hikeid)}
              disabled={deletingHikeId === hikeToDelete?.id}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {deletingHikeId === hikeToDelete?.id ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Edit Hike Modal */}
      <EditHikeModal />
      
      {/* Hike Details Modal */}
      <HikeDetailsModal />
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal />

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
            <button 
              onClick={() => navigate("/dashboard/CreateHike")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center gap-2 mx-auto"
            >
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
        {/* Your Upcoming Hikes */}
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
            <button 
              onClick={handleViewAllHikes}
              className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
            >
              {showAllHikes ? 'Show Less' : 'View All'} {showAllHikes ? '' : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">Loading your hikes...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
                <div className="text-red-500 mb-2">
                  <Mountain className="w-8 h-8 mx-auto" />
                </div>
                <p className="text-red-700 dark:text-red-400 font-medium mb-2">Unable to load hikes</p>
                <p className="text-red-600 dark:text-red-500 text-sm">{error}</p>
                {!currentUser && (
                  <button 
                    onClick={() => navigate("/login")}
                    className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
                  >
                    Go to Login
                  </button>
                )}
              </div>
            </div>
          ) : hikes.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Mountain className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No planned hikes yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Start planning your first adventure and create unforgettable memories!
              </p>
              <button 
                onClick={() => navigate("/dashboard/CreateHike")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Plan Your First Hike
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(showAllHikes ? hikes : hikes.slice(0, 4)).map((hike) => (
                <div key={hike.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all">
                  <div className="flex">
                    <div className="w-32 h-32 flex-shrink-0">
                      <img 
                        src={hike.image} 
                        alt={hike.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1648804536048-0a7d8b103bbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb3VudGFpbiUyMGhpa2luZyUyMHRyYWlsJTIwc2NlbmljfGVufDF8fHx8MTc1NjIxNjU5Nnww&ixlib=rb-4.1.0&q=80&w=1080';
                        }}
                      />
                    </div>
                    <div className="flex-1 p-4 relative">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg line-clamp-1 pr-8">
                          {hike.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            hike.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : hike.status === 'planned'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          }`}>
                            {hike.status}
                          </span>
                          <div className="relative">
                            <button
                              onClick={(e) => toggleDropdown(hike.id, e)}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            >
                              <MoreVertical className="w-4 h-4 text-gray-500" />
                            </button>
                            {activeDropdown === hike.id && (
                              <div className="absolute right-0 top-8 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10 min-w-[120px]">
                                <button
                                  onClick={() => handleViewHike(hike)}
                                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2 first:rounded-t-lg"
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </button>
                                <button
                                  onClick={() => handleEditHike(hike)}
                                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2"
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => confirmDeleteHike(hike)}
                                  className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2 last:rounded-b-lg"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 flex items-center gap-1 line-clamp-1">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
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
                          {hike.attendees || 1}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-medium ${
                          getDaysUntil(hike.date) === 'Today' || getDaysUntil(hike.date) === 'Tomorrow'
                            ? 'text-orange-600 dark:text-orange-400'
                            : getDaysUntil(hike.date) === 'Past'
                            ? 'text-gray-400 dark:text-gray-500'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {getDaysUntil(hike.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hikes.length > 4 && !showAllHikes && (
            <div className="text-center mt-6">
              <button 
                onClick={handleViewAllHikes}
                className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 font-medium flex items-center gap-1 mx-auto transition-colors"
              >
                View All {hikes.length} Hikes <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="text-center mt-8">
            <button 
              onClick={() => navigate("/dashboard/CreateHike")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto"
            >
              <Mountain className="w-5 h-5" />
              Plan Another Hike
            </button>
          </div>
        </div>

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