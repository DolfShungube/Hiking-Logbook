import React, { useState, useEffect } from 'react';
import { 
  Mountain, 
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  Compass,
  Camera,
  Clock,
  Award,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Gauge,
  MountainIcon,
  Play,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import RouteTracker from "../components/map.jsx";
import ElevationProfile from "../components/ElevationMap.jsx";
import { RouteDataCollection } from "../context/MapRoutesContext.jsx";
import { GoalDataCollection } from "../context/GoalsContext.jsx";

// Goals Modal Component
const GoalsModal = ({ 
  showGoalsModal, 
  setShowGoalsModal, 
  selectedHike, 
  formatDate,
  currentUser
}) => {
  const [goals, setGoals] = useState([]);
  const [goal, setGoal] = useState('');
  const { getGoals, addGoal, updateGoalStatus, deleteGoal } = GoalDataCollection();

  const fetchGoals = async () => {
    try {
      const hikeId = selectedHike.hikeid || selectedHike.id;
      const data = await getGoals(hikeId, currentUser.id);
      setGoals(data || []);
    } catch (err) {
      console.error("Error fetching goals:", err);
    }
  };

  useEffect(() => {
    if (showGoalsModal && selectedHike && currentUser?.id) {
      fetchGoals();
    }
  }, [showGoalsModal, selectedHike, currentUser?.id]);

  const handleAddGoal = async () => {
    if (!goal.trim()) return;
    try {
      const hikeId = selectedHike.hikeid || selectedHike.id;
      await addGoal(hikeId, goal, currentUser.id);
      setGoal('');
      fetchGoals();
    } catch (err) {
      console.error("Error adding goal:", err);
    }
  };

  const handleToggleGoal = async (goalItem) => {
    try {
      const hikeId = selectedHike.hikeid || selectedHike.id;
      const newStatus = goalItem.status === 'complete' ? 'incomplete' : 'complete';
      await updateGoalStatus(hikeId, goalItem.goal, newStatus, currentUser.id);
      fetchGoals();
    } catch (err) {
      console.error("Error updating goal status:", err);
    }
  };

  const handleRemoveGoal = async (goalObj) => {
    try {
      const hikeId = selectedHike.hikeid || selectedHike.id;
      await deleteGoal(hikeId, goalObj.goal, currentUser.id);
      fetchGoals();
    } catch (err) {
      console.error("Error deleting goal:", err);
    }
  };

  if (!showGoalsModal || !selectedHike) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Goals
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {selectedHike.title} • {formatDate(selectedHike.startdate)}
              </p>
            </div>
            <button
              onClick={() => setShowGoalsModal(false)}
              className="w-8 h-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="e.g., Reach the summit by noon, Take photos at viewpoint..."
              className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
            />
            <button
              onClick={handleAddGoal}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Add
            </button>
          </div>
          <ul className="space-y-2">
            {goals.length === 0 && (
              <li className="text-gray-500 dark:text-gray-400">No goals yet.</li>
            )}
            {goals.map((g, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center p-2 rounded bg-gray-100 dark:bg-gray-900"
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={g.status === 'complete'}
                    onChange={() => handleToggleGoal(g)}
                    className="form-checkbox h-5 w-5 text-green-500"
                  />
                  <span className={`text-gray-800 dark:text-gray-200 ${g.status === 'complete' ? 'line-through' : ''}`}>
                    {g.goal}
                  </span>
                </label>
                <button
                  onClick={() => handleRemoveGoal(g)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={() => setShowGoalsModal(false)}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Edit Hike Modal Component
const EditHikeModal = ({
  showEditModal,
  setShowEditModal,
  editTitle,
  setEditTitle,
  editLocation,
  setEditLocation,
  editDate,
  setEditDate,
  editTime,
  setEditTime,
  editStatus,
  setEditStatus,
  editDifficulty,
  setEditDifficulty,
  editDistance,
  setEditDistance,
  editElevation,
  setEditElevation,
  resetEditForm,
  handleSaveEdit,
  savingEdit
}) => {
  if (!showEditModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Hike
            </h2>
            <button
              onClick={() => {
                setShowEditModal(false);
                resetEditForm();
              }}
              className="w-8 h-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors text-xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hike Title
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter hike title"
            />
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time
              </label>
              <input
                type="time"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="planned">Planned</option>
                <option value="confirmed">Confirmed</option>
                <option value="in progress">In Progress</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end">
          <button
            onClick={() => {
              setShowEditModal(false);
              resetEditForm();
            }}
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
      </div>
    </div>
  );
};


// Hike Details Modal Component
const HikeDetailsModal = ({ 


  showHikeModal, 
  setShowHikeModal, 
  selectedHike, 
  handleEditHike, 
  formatDate, 
  formatTime, 
  getDaysUntil,
  formatDistance,
  formatElevation
}) => {
  if (!showHikeModal || !selectedHike) return null;
    const [showMapModal, setShowMapModal] = useState(false);
    const { getRouteJson } = RouteDataCollection();
    const [mapData, setMapData] = useState(null);



  const handleMap = async (routeid) => {
    if (routeid) {
      let data = await getRouteJson(routeid);
      if (data[0]) setMapData(data[0]?.path || null);
    }
  }


  useEffect(()=>{
       if (!mapData) {
        handleMap(selectedHike.route);
      }
   
  },[selectedHike])

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img 
            src={selectedHike.image || 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=400&fit=crop'} 
            alt={selectedHike.title}
            className="w-full h-48 object-cover rounded-t-xl"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=400&fit=crop';
            }}
          />
          <button
            onClick={() => setShowHikeModal(false)}
            className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors text-xl"
          >
            ×
          </button>
          <div className="absolute bottom-4 left-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              selectedHike.status === 'confirmed' 
                ? 'bg-green-100 text-green-800'
                : selectedHike.status === 'planned'
                ? 'bg-yellow-100 text-yellow-800'
                : selectedHike.status === 'in progress'
                ? 'bg-orange-100 text-orange-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {selectedHike.status}
            </span>
          </div>
        </div>

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
              <span>{selectedHike?.hikinggroup?.members?.length || 1} attendees</span>
            </div>
            {selectedHike.distance && (
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Gauge className="w-5 h-5" />
                <span>{formatDistance(selectedHike.distance)}</span>
              </div>
            )}
            {selectedHike.elevation && (
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <MountainIcon className="w-5 h-5" />
                <span>{formatElevation(selectedHike.elevation)}</span>
              </div>
            )}

          <div>

          <button
            onClick={() => setShowMapModal(true)}
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700 transition"
          >
            <MapPin className="w-4 h-4" />
            View Path
          </button>
        </div>

              {showMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[90%] max-w-4xl h-[80vh] p-4">

            <button
              onClick={() => setShowMapModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>


            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
              Route Map Preview
            </h2>
           

            <div className="w-full h-[90%] rounded-xl overflow-y-auto border border-gray-400">
           
              <div>
              <div className="w-full h-[32rem] rounded-lg overflow-hidden border border-gray-400">
                <RouteTracker preview routeGeoJSON={mapData} className="w-full h-full" />
              </div>
              <div>
                <ElevationProfile routeGeoJSON={mapData} />
              </div>
              </div>
              
            </div>
          </div>
        </div>
      )}


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
      </div>
    </div>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ 
  showDeleteModal, 
  setShowDeleteModal, 
  hikeToDelete, 
  setHikeToDelete, 
  handleDeleteHike, 
  deletingHikeId 
}) => {
  if (!showDeleteModal || !hikeToDelete) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
              onClick={() => handleDeleteHike(hikeToDelete.hikeid || hikeToDelete.id)}
              disabled={deletingHikeId === (hikeToDelete?.hikeid || hikeToDelete?.id)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {deletingHikeId === (hikeToDelete?.hikeid || hikeToDelete?.id) ? (
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
};

// Main Component
const PlanHikeDefault = () => {
  
  const [activeStep, setActiveStep] = useState(0);
  const [hikes, setHikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingHikeId, setDeletingHikeId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hikeToDelete, setHikeToDelete] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showAllHikes, setShowAllHikes] = useState(false);
  const [selectedHike, setSelectedHike] = useState(null);
  const [showHikeModal, setShowHikeModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingHike, setEditingHike] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editDifficulty, setEditDifficulty] = useState('');
  const [editStatus, setEditStatus] = useState('planned');
  const [editDistance, setEditDistance] = useState('');
  const [editElevation, setEditElevation] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  const navigate = useNavigate();
  const { currentUser } = UserAuth();

  const defaultHikeImage = 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop';

  useEffect(() => {
    const fetchHikes = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!currentUser?.id) {
          setError("Please log in to view your hikes.");
          return;
        }

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
        setHikes(result.data || []); 
        
      } catch (err) {
        console.error("Error fetching hikes:", err);
        setError("Failed to load hikes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

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
      return 'Invalid time';
    }
  };

  const formatDistance = (distance) => {
    if (!distance) return 'N/A';
    return `${distance} km`;
  };

  const formatElevation = (elevation) => {
    if (!elevation) return 'N/A';
    return `${elevation} m`;
  };

  const getDaysUntil = (dateString) => {
    if (!dateString) return 'No date';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const hikeDate = new Date(dateString);
    hikeDate.setHours(0, 0, 0, 0);
    
    const diffTime = hikeDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return 'Past';
    return `${diffDays} days`;
  };

  const resetEditForm = () => {
    setEditTitle('');
    setEditLocation('');
    setEditDate('');
    setEditTime('');
    setEditDifficulty('easy');
    setEditStatus('planned');
    setEditDistance('');
    setEditElevation('');
    setEditingHike(null);
  };

  const getDateFromTimestamp = (timestamp) => {
    if (!timestamp) return '';
    try {
      return new Date(timestamp).toISOString().split('T')[0];
    } catch (error) {
      return '';
    }
  };

  const getTimeFromTimestamp = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (error) {
      return '';
    }
  };

  const combineDateAndTime = (dateStr, timeStr) => {
    if (!dateStr) return new Date().toISOString();
    
    const date = new Date(dateStr);
    if (timeStr) {
      const [hours, minutes] = timeStr.split(':');
      date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    }
    return date.toISOString();
  };

  const handleViewHike = (hike) => {
    setSelectedHike(hike);
    setShowHikeModal(true);
    setActiveDropdown(null);
  };

  const handleEditHike = (hike) => {
    setEditingHike(hike);
    setEditTitle(hike.title || '');
    setEditLocation(hike.location || '');
    setEditDate(getDateFromTimestamp(hike.startdate));
    setEditTime(getTimeFromTimestamp(hike.startdate));
    setEditDifficulty(hike.difficulty || 'easy');
    setEditStatus(hike.status || 'planned');
    setEditDistance(hike.distance?.toString() || '');
    setEditElevation(hike.elevation?.toString() || '');
    setShowEditModal(true);
    setActiveDropdown(null);
  };



 const handleStartHike = async (hike) => {
  try {
    console.log('=== START HIKE ATTEMPT ===');
    console.log('Attempting to start hike:', hike.title);
    
    // Check if there's already a hike in progress using the /current-hike endpoint
    try {
      const checkResponse = await fetch(`https://hiking-logbook-api.onrender.com/current-hike?userid=${currentUser.id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (checkResponse.ok) {
        const checkResult = await checkResponse.json();
        
        // If there's any hike in progress, block the request
        if (checkResult.data && checkResult.data.length > 0) {
          const hikeInProgress = checkResult.data[0];
          const message = `You already have a hike in progress: "${hikeInProgress.title || 'Unnamed Hike'}". Please complete or cancel it before starting another.`;
          console.log('BLOCKING: Hike in progress found:', hikeInProgress);
          setSubmitMessage(message);
          setActiveDropdown(null);
          setTimeout(() => setSubmitMessage(null), 5000);
          return; // STOP - don't allow starting another hike
        }
      }
    } catch (checkErr) {
      console.error('Error checking for hikes in progress:', checkErr);
      setError("Unable to verify hike status. Please try again.");
      setTimeout(() => setError(null), 5000);
      setActiveDropdown(null);
      return;
    }

    console.log('No hike in progress found, proceeding to start:', hike.title);

    const hikeId = hike.hikeid || hike.id;
    
    if (!hikeId) {
      throw new Error('Hike ID not found');
    }

    const response = await fetch(`https://hiking-logbook-api.onrender.com/planned-hikes/${hikeId}/${currentUser.id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: hike.title,
        location: hike.location,
        startdate: hike.startdate,
        difficulty: hike.difficulty,
        distance: hike.distance,
        elevation: hike.elevation,
        status: 'in progress'
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to start hike (Status: ${response.status})`);
    }

    const result = await response.json();
    
    console.log('API Response:', result);

    // Update the UI to remove this hike from the planned list
    setHikes(prevHikes => prevHikes.filter(h => (h.hikeid || h.id) !== hikeId));



    setActiveDropdown(null);
    setError(null); // Clear any existing errors
    
    // Show success message
    const successMessage = `"${hike.title}" started successfully!`;
    setSubmitMessage(successMessage);
    setTimeout(() => setSubmitMessage(null), 3000);
    
  } catch (err) {
    console.error("Error starting hike:", err);
    const errorMessage = err.message || "Failed to start hike. Please try again.";
    setError(errorMessage);
    setTimeout(() => setError(null), 5000);
    setActiveDropdown(null);
  }
};

  const handleSaveEdit = async () => {
    try {
      setSavingEdit(true);
      
      const hikeId = editingHike.hikeid || editingHike.id;
      
      if (!hikeId) {
        throw new Error('Hike ID not found');
      }

      const newStartDate = combineDateAndTime(editDate, editTime);

      const response = await fetch(`https://hiking-logbook-api.onrender.com/planned-hikes/${hikeId}/${currentUser.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editTitle,
          location: editLocation,
          startdate: newStartDate,
          difficulty: editDifficulty,
          distance: parseFloat(editDistance) || editingHike.distance,
          elevation: parseFloat(editElevation) || editingHike.elevation,
          status: editStatus
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to update hike: ${response.status}`);
      }

      setHikes(prevHikes =>
        prevHikes.map(hike => {
          const currentHikeId = hike.hikeid || hike.id;
          return currentHikeId === hikeId
            ? { 
                ...hike, 
                title: editTitle,
                location: editLocation,
                startdate: newStartDate, 
                difficulty: editDifficulty,
                distance: parseFloat(editDistance) || hike.distance,
                elevation: parseFloat(editElevation) || hike.elevation,
                status: editStatus
              }
            : hike;
        })
      );

      setShowEditModal(false);
      resetEditForm();
      
    } catch (err) {
      console.error("Error updating hike:", err);
      setError("Failed to update hike. Please try again.");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteHike = async (hikeId) => {
    try {
      setDeletingHikeId(hikeId);

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

      setHikes(hikes.filter(hike => (hike.hikeid || hike.id) !== hikeId));
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

  const confirmDeleteHike = (hike) => {
    setHikeToDelete(hike);
    setShowDeleteModal(true);
    setActiveDropdown(null);
  };

  const handleViewAllHikes = () => {
    setShowAllHikes(!showAllHikes);
  };

  const toggleDropdown = (hikeId, e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === hikeId ? null : hikeId);
  };

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <EditHikeModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        editLocation={editLocation}
        setEditLocation={setEditLocation}
        editDate={editDate}
        setEditDate={setEditDate}
        editTime={editTime}
        setEditTime={setEditTime}
        editStatus={editStatus}
        setEditStatus={setEditStatus}
        editDifficulty={editDifficulty}
        setEditDifficulty={setEditDifficulty}
        editDistance={editDistance}
        setEditDistance={setEditDistance}
        editElevation={editElevation}
        setEditElevation={setEditElevation}
        resetEditForm={resetEditForm}
        handleSaveEdit={handleSaveEdit}
        savingEdit={savingEdit}
      />
      
      <HikeDetailsModal
        showHikeModal={showHikeModal}
        setShowHikeModal={setShowHikeModal}
        selectedHike={selectedHike}
        handleEditHike={handleEditHike}
        formatDate={formatDate}
        formatTime={formatTime}
        getDaysUntil={getDaysUntil}
        formatDistance={formatDistance}
        formatElevation={formatElevation}
      />

      <GoalsModal
        showGoalsModal={showGoalsModal}
        setShowGoalsModal={setShowGoalsModal}
        selectedHike={selectedHike}
        formatDate={formatDate}
        currentUser={currentUser}
      />
      
      <DeleteConfirmationModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        hikeToDelete={hikeToDelete}
        setHikeToDelete={setHikeToDelete}
        handleDeleteHike={handleDeleteHike}
        deletingHikeId={deletingHikeId}
      />

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
                <div key={hike.hikeid || hike.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
                  <div className="flex">
                    <div className="w-32 h-32 flex-shrink-0">
                      <img 
                        src={hike.image || defaultHikeImage} 
                        alt={hike.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = defaultHikeImage;
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
                              : hike.status === 'in progress'
                              ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          }`}>
                            {hike.status}
                          </span>
                          <div className="relative">
                            <button
                              onClick={(e) => toggleDropdown(hike.hikeid || hike.id, e)}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            >
                              <MoreVertical className="w-4 h-4 text-gray-500" />
                            </button>
                            {activeDropdown === (hike.hikeid || hike.id) && (
                              <div className="absolute right-0 top-8 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10 min-w-[140px]">
                                <button
                                  onClick={() => handleViewHike(hike)}
                                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2 first:rounded-t-lg"
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedHike(hike);
                                    setShowGoalsModal(true);
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2"
                                >
                                  <Award className="w-4 h-4" />
                                  Goals
                                </button>
                                {(hike.status === 'planned' || hike.status === 'confirmed') && (
                                  <button
                                    onClick={() => handleStartHike(hike)}
                                    className="w-full px-3 py-2 text-left text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 flex items-center gap-2"
                                  >
                                    <Play className="w-4 h-4" />
                                    Start Hike
                                  </button>
                                )}
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
                          {formatDate(hike.startdate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(hike.startdate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {hike?.hikinggroup?.members?.length || 1}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-medium ${
                          getDaysUntil(hike.startdate) === 'Today' || getDaysUntil(hike.startdate) === 'Tomorrow'
                            ? 'text-orange-600 dark:text-orange-400'
                            : getDaysUntil(hike.startdate) === 'Past'
                            ? 'text-gray-400 dark:text-gray-500'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {getDaysUntil(hike.startdate)}
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