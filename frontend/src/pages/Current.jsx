import React, { useEffect, useState } from "react";
import { MapPinned, Clock, Activity, Map, X } from "lucide-react";
import RouteTracker from "../components/map.jsx";
import { GoalDataCollection } from "../context/GoalsContext";
import { NotesDataCollection } from "../context/NotesContext";
import { useParams } from "react-router-dom";
import { hikeDataCollection } from "../context/hikeDataContext.jsx";
import { createClient } from "@supabase/supabase-js";
import "mapbox-gl/dist/mapbox-gl.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});

const Current = () => {
  const [coords, setCoords] = useState(null);
  const [currentCoords, setCurrentCoords] = useState(null);
  const [realTimeDistance, setRealTimeDistance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [pathCoords, setPathCoords] = useState([]);

  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);

  // Goals state
  const [goal, setGoal] = useState("");
  const [goalsList, setGoalsList] = useState([]);

  // Notes state
  const [note, setNote] = useState("");
  const [editedNote, setEditedNote] = useState(null);
  const [notesList, setNotesList] = useState([]);

  const { hikeid } = useParams();
  const { getCoordinates } = hikeDataCollection();
  const { getGoals, addGoal, updateGoalStatus } = GoalDataCollection();
  const { getNotes, addNote, updateNote, deleteNote } = NotesDataCollection();

  // Fetch current user ID
  const getCurrentUserId = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.id ?? null;
    } catch (err) {
      console.error("Error getting user:", err);
      setError("Could not get current user");
      return null;
    }
  };

  // Fetch start coordinates and trail path
  const fetchStartCoordinates = async () => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        setError("User not logged in");
        setLoading(false);
        return;
      }
      const coordsData = await getCoordinates(userId);
      if (!coordsData?.start || !coordsData?.path) {
        setError("No start coordinates or path found");
        setLoading(false);
        return;
      }

      setCoords({ lat: coordsData.start[1], lng: coordsData.start[0] });
      setDifficulty(coordsData.difficulty || "Unknown");
      setPathCoords(coordsData.path.map(([lat, lng]) => [lng, lat]));
    } catch (err) {
      console.error("Error fetching coordinates:", err);
      setError("Error fetching start coordinates");
    } finally {
      setLoading(false);
    }
  };

  // Fetch goals
  const fetchGoals = async () => {
    try {
      const data = await getGoals(hikeid);
      setGoalsList(data);
    } catch (err) {
      console.error("Error fetching goals:", err);
    }
  };

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const data = await getNotes(hikeid);
      setNotesList(data); // data expected as [{date, text}, ...]
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  // Add goal
  const handleAddGoal = async () => {
    if (!goal.trim()) return;
    try {
      await addGoal(hikeid, goal);
      setGoal("");
      fetchGoals();
    } catch (err) {
      console.error("Error adding goal:", err);
    }
  };

  // Notes functions
  const handleSaveNote = async () => {
    if (!note.trim()) return;

    try {
      if (editedNote) {
        await updateNote(hikeid, editedNote.date, note);
        setEditedNote(null);
      } else {
        await addNote(hikeid, note);
      }
      setNote("");
      fetchNotes();
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  const handleEditNote = (noteObj) => {
    setEditedNote(noteObj);
    setNote(noteObj.text);
  };

  const handleDeleteNote = async (noteObj) => {
    try {
      await deleteNote(hikeid, noteObj.date);
      setNotesList((prev) => prev.filter((n) => n.date !== noteObj.date));
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  // Toggle goal status (checkbox)
  const handleToggleGoal = async (goalItem) => {
    try {
      const newStatus = goalItem.status === "complete" ? "incomplete" : "complete";
      await updateGoalStatus(hikeid, goalItem.goal, newStatus);
      setGoalsList((prev) =>
        prev.map((g) => (g.goal === goalItem.goal ? { ...g, status: newStatus } : g))
      );
    } catch (err) {
      console.error("Error updating goal status:", err);
    }
  };

  // Haversine formula
  const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(deltaPhi / 2) ** 2 +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  // Track live position
  useEffect(() => {
    if (!coords || pathCoords.length === 0) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCurrentCoords(newCoords);

        let closestIndex = 0;
        let minDist = Infinity;
        pathCoords.forEach(([lng, lat], idx) => {
          const d = getDistanceFromLatLonInMeters(lat, lng, newCoords.lat, newCoords.lng);
          if (d < minDist) {
            minDist = d;
            closestIndex = idx;
          }
        });

        let walkedDistance = 0;
        for (let i = 1; i <= closestIndex; i++) {
          walkedDistance += getDistanceFromLatLonInMeters(
            pathCoords[i - 1][1],
            pathCoords[i - 1][0],
            pathCoords[i][1],
            pathCoords[i][0]
          );
        }
        setRealTimeDistance(walkedDistance);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Could not get current location. Please allow location access.");
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 60000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [coords, pathCoords]);

  // Fetch all initial data
  useEffect(() => {
    fetchStartCoordinates();
    fetchGoals();
    fetchNotes();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading hike info...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Your Current Hike
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Map */}
          <div className="lg:col-span-8 bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden shadow-lg">
            {coords && pathCoords.length > 0 ? (
              <RouteTracker
                routeGeoJSON={pathCoords}
                className="w-full h-[420px]"
                currentPosition={currentCoords ? [currentCoords.lng, currentCoords.lat] : null}
              />
            ) : (
              <p className="text-center text-gray-500">Loading map...</p>
            )}
          </div>

          {/* Trail Info */}
          <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg flex flex-col justify-between transition-all hover:shadow-xl">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 border-b pb-2 border-gray-200 dark:border-gray-700">
                Trail Info
              </h3>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-3">
                  <Map size={20} className="text-blue-500" />
                  <span className="font-medium">Distance:</span>
                  <span className="ml-auto">{(realTimeDistance / 1000).toFixed(2)} km</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock size={20} className="text-green-500" />
                  <span className="font-medium">Time:</span>
                  <span className="ml-auto">3 hrs</span>
                </li>
                <li className="flex items-center gap-3">
                  <Activity size={20} className="text-red-500" />
                  <span className="font-medium">Difficulty:</span>
                  <span className="ml-auto">{difficulty || "Loading..."}</span>
                </li>
                <li className="flex items-center gap-3">
                  <MapPinned size={20} className="text-purple-500" />
                  <span className="font-medium">Duration:</span>
                  <span className="ml-auto">2 hrs left</span>
                </li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setShowNotesModal(true)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition"
              >
                Notes
              </button>
              <button
                onClick={() => setShowGoalsModal(true)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition"
              >
                Goals
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Modal */}
      {showGoalsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-lg relative">
            <button
              onClick={() => setShowGoalsModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Goals
            </h3>

            <ul className="mb-4 space-y-2 max-h-60 overflow-y-auto">
              {goalsList.map((g, idx) => (
                <li
                  key={idx}
                  className="flex items-center p-2 bg-gray-100 dark:bg-gray-700 rounded"
                >
                  <input
                    type="checkbox"
                    checked={g.status === "complete"}
                    onChange={() => handleToggleGoal(g)}
                    className="mr-2"
                  />
                  <span
                    className={`cursor-pointer ${g.status === "complete" ? "line-through text-gray-400" : ""}`}
                  >
                    {g.goal}
                  </span>
                </li>
              ))}
            </ul>

            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Enter new goal..."
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 mb-4 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleAddGoal}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold"
            >
              Add Goal
            </button>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-lg relative">
            <button
              onClick={() => setShowNotesModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Notes
            </h3>

            <ul className="mb-4 space-y-2 max-h-60 overflow-y-auto">
              {notesList.map((n) => (
                <li
                  key={n.date}
                  className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded"
                >
                  <span>{n.text}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditNote(n)}
                      className="text-yellow-500 hover:text-yellow-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteNote(n)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter new note..."
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 mb-4 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleSaveNote}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold"
            >
              {editedNote ? "Save Note" : "Add Note"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Current;
