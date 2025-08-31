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
  Plus,
  Save,
  X
} from 'lucide-react';

const PlanHikeDefault = () => {
  const [plannedHikes, setPlannedHikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingHike, setEditingHike] = useState(null);
  const [testUserId, setTestUserId] = useState('test-user-123');

  // Form state for editing
  const [editForm, setEditForm] = useState({
    startdate: '',
    location: '',
    weather: '',
    elevation: '',
    route: '',
    distance: '',
    hikinggroup: '',
    difficulty: ''
  });

  // Base URL for your API - adjust this to match your server
  const API_BASE_URL = 'http://localhost:8080';

  // Fetch planned hikes
  const fetchPlannedHikes = async () => {
    setLoading(true);
    setError(null);
    
    // Validate user ID
    if (!testUserId || testUserId.trim() === '') {
      setError('Please enter a valid user ID');
      setLoading(false);
      return;
    }

    try {
      const cleanUserId = encodeURIComponent(testUserId.trim());
      console.log('Fetching planned hikes for user:', cleanUserId);
      
      const response = await fetch(`${API_BASE_URL}/planned-hikes?userid=${cleanUserId}`);
      console.log('Response status:', response.status);
      
      const result = await response.json();
      console.log('Response data:', result);
      
      if (response.ok) {
        const hikesData = Array.isArray(result.data) ? result.data : [];
        setPlannedHikes(hikesData);
      } else {
        setError(result.error || 'Failed to fetch planned hikes');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit planned hike
  const editPlannedHike = async (hikeId) => {
    setLoading(true);
    setError(null);
    
    // Prepare the data to send
    const dataToSend = {
      ...editForm,
      weather: { description: editForm.weather } // Convert weather string to object
    };
    
    console.log('Editing hike:', hikeId, 'with data:', dataToSend);
    
    try {
      const response = await fetch(`${API_BASE_URL}/planned-hikes/${hikeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });
      
      console.log('Edit response status:', response.status);
      const result = await response.json();
      console.log('Edit response data:', result);
      
      if (response.ok) {
        // Update the hike in local state
        setPlannedHikes(prev => prev.map(hike => 
          hike.hikeid === hikeId ? result.hike : hike
        ));
        setEditingHike(null);
        setEditForm({
          startdate: '',
          location: '',
          weather: '',
          elevation: '',
          route: '',
          distance: '',
          hikinggroup: '',
          difficulty: ''
        });
      } else {
        setError(result.error || 'Failed to update hike');
      }
    } catch (err) {
      console.error('Edit error:', err);
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete planned hike
  const deletePlannedHike = async (hikeId) => {
    if (!window.confirm('Are you sure you want to delete this planned hike?')) {
      return;
    }

    setLoading(true);
    setError(null);
    
    console.log('Deleting hike:', hikeId);
    
    try {
      const response = await fetch(`${API_BASE_URL}/planned-hikes/${hikeId}`, {
        method: 'DELETE'
      });
      
      console.log('Delete response status:', response.status);
      const result = await response.json();
      console.log('Delete response data:', result);
      
      if (response.ok) {
        // Remove the hike from local state
        setPlannedHikes(prev => prev.filter(hike => hike.hikeid !== hikeId));
      } else {
        setError(result.error || 'Failed to delete hike');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Start editing a hike
  const startEditing = (hike) => {
    setEditingHike(hike.hikeid);
    setEditForm({
      startdate: hike.startdate || '',
      location: hike.location || '',
      weather: typeof hike.weather === 'object' ? hike.weather.description || '' : hike.weather || '',
      elevation: hike.elevation || '',
      route: hike.route || '',
      distance: hike.distance || '',
      hikinggroup: hike.hikinggroup || '',
      difficulty: hike.difficulty || ''
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingHike(null);
    setEditForm({
      startdate: '',
      location: '',
      weather: '',
      elevation: '',
      route: '',
      distance: '',
      hikinggroup: '',
      difficulty: ''
    });
  };

  // Load planned hikes on component mount
  useEffect(() => {
    fetchPlannedHikes();
  }, [testUserId]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Test Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            API Endpoint Tester
          </h3>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Test User ID:
              </label>
              <input
                type="text"
                value={testUserId}
                onChange={(e) => setTestUserId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter user ID to test"
              />
            </div>
            
            <button
              onClick={fetchPlannedHikes}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              {loading ? 'Loading...' : 'Fetch Planned Hikes'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* Planned Hikes Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Planned Hikes ({plannedHikes.length})
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Test your planned hikes endpoints
            </p>
          </div>
        </div>

        {/* Planned Hikes List */}
        <div className="space-y-6">
          {plannedHikes.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
              <Mountain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No planned hikes found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {loading ? 'Loading planned hikes...' : 'No planned hikes for this user ID'}
              </p>
            </div>
          ) : (
            plannedHikes.map((hike, index) => (
              <div key={hike.hikeid || `hike-${index}`} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                {editingHike === hike.hikeid ? (
                  // Edit Form
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Edit Planned Hike
                      </h3>
                      <button
                        onClick={cancelEditing}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Start Date
                        </label>
                        <input
                          type="datetime-local"
                          value={editForm.startdate}
                          onChange={(e) => setEditForm(prev => ({ ...prev, startdate: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={editForm.location}
                          onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      
                      <div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
    Weather
  </label>
  <input
    type="text"
    value={typeof editForm.weather === 'object' ? editForm.weather.description || '' : editForm.weather || ''}
    onChange={(e) => setEditForm(prev => ({ 
      ...prev, 
      weather: { description: e.target.value } 
    }))}
    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
    placeholder="e.g., sunny, cloudy, rainy"
  />
</div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Elevation (m)
                        </label>
                        <input
                          type="number"
                          value={editForm.elevation}
                          onChange={(e) => setEditForm(prev => ({ ...prev, elevation: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Route
                        </label>
                        <input
                          type="text"
                          value={editForm.route}
                          onChange={(e) => setEditForm(prev => ({ ...prev, route: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Distance (m)
                        </label>
                        <input
                          type="number"
                          value={editForm.distance}
                          onChange={(e) => setEditForm(prev => ({ ...prev, distance: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Hiking Group
                        </label>
                        <input
                          type="text"
                          value={editForm.hikinggroup}
                          onChange={(e) => setEditForm(prev => ({ ...prev, hikinggroup: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Difficulty
                        </label>
                        <select
                          value={editForm.difficulty}
                          onChange={(e) => setEditForm(prev => ({ ...prev, difficulty: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">Select difficulty</option>
                          <option value="Easy">Easy</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Hard">Hard</option>
                          <option value="Expert">Expert</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => editPlannedHike(hike.hikeid)}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      
                      <button
                        onClick={cancelEditing}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <Mountain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {hike.location || 'Unnamed Location'}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            ID: {hike.hikeid}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(hike)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                          title="Edit hike"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => deletePlannedHike(hike.hikeid)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-md transition-colors"
                          title="Delete hike"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {hike.startdate ? new Date(hike.startdate).toLocaleDateString() : 'No date'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{hike.route || 'No route'}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">{hike.elevation || 0}m</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Compass className="w-4 h-4" />
                        <span className="text-sm">{hike.distance || 0}m</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">
                          {typeof hike.hikinggroup === 'object' ? 
                            JSON.stringify(hike.hikinggroup) : 
                            (hike.hikinggroup || 'Solo')
                          }
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Star className="w-4 h-4" />
                        <span className="text-sm">{hike.difficulty || 'Unknown'}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
  {typeof hike.weather === 'object' ? 
    hike.weather.description || 'Unknown weather' : 
    (hike.weather || 'Unknown weather')
  }
</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* API Response Debug Info */}
        {plannedHikes.length > 0 && (
          <div className="mt-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API Response Debug (Last {plannedHikes.length} hikes):
            </h4>
            <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
              {JSON.stringify(plannedHikes, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanHikeDefault;