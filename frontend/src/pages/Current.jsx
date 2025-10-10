import React, { useEffect, useState } from "react";
import { MapPinned, Clock, Activity, Map, X ,Thermometer} from "lucide-react";
import RouteTracker from "../components/map.jsx";
import ElevationProfile from "../components/ElevationMap.jsx";
import { GoalDataCollection } from "../context/GoalsContext";
import { NotesDataCollection } from "../context/NotesContext";
import { useParams, useNavigate } from "react-router-dom";
import { hikeDataCollection } from "../context/hikeDataContext.jsx";
import { RouteDataCollection } from "../context/MapRoutesContext.jsx";
import { createClient } from "@supabase/supabase-js";
import "mapbox-gl/dist/mapbox-gl.css";
import { UserAuth } from "../context/AuthContext.jsx";
//import { distance } from "@turf/turf";
//import { set } from "../../../backend/server.js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});

// Utility function to format seconds into HH:MM:SS (FIX #3)
const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map(val => String(val).padStart(2, '0'))
    .join(':');
};

const Current = () => {
  const [coords, setCoords] = useState(null);
  const [location,setLocation]= useState(null);
  const [weather,setWeather]= useState(null);
  const [currentCoords, setCurrentCoords] = useState(null);
  const [realTimeDistance, setRealTimeDistance] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [pathCoords, setPathCoords] = useState([]);
  const [mapData, setMapData] = useState(null);

  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);

  // Goals state
  const [goal, setGoal] = useState("");
  const [goalsList, setGoalsList] = useState([]);

  // Notes state
  const [note, setNote] = useState("");
  const [notesList, setNotesList] = useState([]);

  const { hikeid } = useParams();
  const navigate = useNavigate();
  const { getCoordinates,getHike,getCurrentHikeData,saveHikeStats,updateHikeStatus} = hikeDataCollection();
  const { getGoals, addGoal, updateGoalStatus } = GoalDataCollection();
  const { getNotes, addNote, removeNote } = NotesDataCollection();
  const { currentUser, authLoading } = UserAuth();
  const { getRouteJson } = RouteDataCollection();

  const handleStartPause = () => {
    setIsTimerRunning(prev => !prev);
  };

  // Fetch start coordinates and trail path
  const fetchStartCoordinates = async () => {
    try {
      const coordsData = await getCoordinates(currentUser.id);
      if (!coordsData?.start || !coordsData?.path) {
        setError("No start coordinates or path found");
        setLoading(false);
        return;
      }
      setCoords({ lat: coordsData.start[1], lng: coordsData.start[0] });
      setDifficulty(coordsData.difficulty || "Unknown");
      setPathCoords(coordsData.path.map(([lat, lng]) => [lng, lat]));
      setLocation(coordsData.location || "Unknown");
      console.log("Data is:", coordsData);
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
      const data = await getGoals(hikeid, currentUser.id);
      setGoalsList(data);
    } catch (err) {
      console.error("Error fetching goals:", err);
    }
  };

  const fetchWeather= async()=>{
    try {
      const response= await getCurrentHikeData(currentUser.id);
      console.log("Response", response);
      if(!response || !Array.isArray(response.data) || response.data.length === 0){
        console.log("No current hike data found");
        return;
      }

      const weatherData = response.data[0]?.weather;
      if (!weatherData) {
        console.log("No weather data found");
        return;
      }
      const {temperature,discription} =weatherData;
      const numericTemp = parseFloat(temperature.replace('°C', ''));
      setWeather({
    temperature:numericTemp.toFixed(1),
    description: discription}) 
      
    } catch (err) {
      console.error("Error fetching weather:", err);
    }
  }


  // Add goal
  const handleAddGoal = async () => {
    if (!goal.trim()) return;
    try {
      await addGoal(hikeid, goal, currentUser.id);
      setGoal("");
      fetchGoals();
    } catch (err) {
      console.error("Error adding goal:", err);
    }
  };

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const data = await getNotes(hikeid, currentUser.id);
      setNotesList(data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };



  // Add note
  const handleAddNote = async () => {
    if (!note.trim()) return;
    try {
      await addNote(hikeid, note, currentUser.id);
      setNote("");
      fetchNotes();
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  // Remove note
  const handleRemoveNote = async (noteObj) => {
    try {
      await removeNote(hikeid, noteObj.text, noteObj.date, currentUser.id);
      setNotesList((prev) => prev.filter((n) => n.date !== noteObj.date));
    } catch (err) {
      console.error("Error removing note:", err);
    }
  };

  // Toggle goal status
  const handleToggleGoal = async (goalItem) => {
    try {
      const newStatus =
        goalItem.status === "complete" ? "incomplete" : "complete";
      await updateGoalStatus(hikeid, goalItem.goal, newStatus, currentUser.id);
      setGoalsList((prev) =>
        prev.map((g) => (g.goal === goalItem.goal ? { ...g, status: newStatus } : g))
      );
    } catch (err) {
      console.error("Error updating goal status:", err);
    }
  };

  const handleMap = async (hike_id, user_id) => {
    let res = await getHike(hike_id, user_id);
    const routeid = res[0]?.route || null;
    if (routeid) {
      let data = await getRouteJson(routeid);
      if (data[0]) setMapData(data[0]?.path || null);
    }
  };

  // Calculate distance
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



 
  useEffect(() => {
    let timerId;

    // Save the running status immediately
    localStorage.setItem("isTimerRunning", isTimerRunning.toString());

    if (isTimerRunning) {
        // On start/resume, save the start time to account for refreshes
        localStorage.setItem("startTime", Date.now().toString());
        
        timerId = setInterval(() => {
         setElapsedTime((prevTime) => {
          const newTime = prevTime + 1;
          // Save the elapsed time every second
          localStorage.setItem("elapsedTime", newTime.toString());
          return newTime;
        });
      }, 1000);
    } else {
      // On pause/stop, clear the start time
      localStorage.removeItem("startTime");
    }

     return () => {
      if (timerId) clearInterval(timerId);
     };
    }, [isTimerRunning]);

   // Effect 2: Loads the saved time, status, and distance from localStorage on mount (FIX #1 part 2, FIX #2 part 1)
   useEffect(() => {
     const savedTime = localStorage.getItem("elapsedTime");
     const savedStatus = localStorage.getItem("isTimerRunning");
     const savedStartTime = localStorage.getItem("startTime");
     const savedDistance = localStorage.getItem("realTimeDistance"); // FIX #2: Load distance

     let initialTime = savedTime ? parseInt(savedTime, 10) : 0;
     let running = savedStatus === "true";

     // FIX #1: Calculate time elapsed since the last save/refresh if the timer was running
     if (running && savedStartTime) {
        const timeSinceStart = Math.floor((Date.now() - parseInt(savedStartTime, 10)) / 1000);
        initialTime += timeSinceStart;
        // Re-save the new total elapsed time immediately to keep it accurate
        localStorage.setItem("elapsedTime", initialTime.toString());
     }
     
     setElapsedTime(initialTime);
     setIsTimerRunning(running);
     
     // FIX #2: Restore distance
     if (savedDistance) {
       setRealTimeDistance(parseFloat(savedDistance));
     }
    }, []); // Runs once on mount


  // Effect 3: Track live position (Updated to save distance - FIX #2 part 2)
  useEffect(() => {
    if (!coords || pathCoords.length === 0) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCurrentCoords(newCoords);

        let closestIndex = 0;
        let minDist = Infinity;
        pathCoords.forEach(([lng, lat], idx) => {
          const d = getDistanceFromLatLonInMeters(
            lat,
            lng,
            newCoords.lat,
            newCoords.lng
          );
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
        // FIX #2: Save distance whenever it updates
        localStorage.setItem("realTimeDistance", walkedDistance.toString());
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Could not get current location. Please allow location access.");
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 60000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [coords, pathCoords]);



// saveHikeStats also a function to update to completed for such hike
      const SaveHike= async()=>{
          setIsTimerRunning(false); 
        try{
            const rawDistance = parseFloat(localStorage.getItem("realTimeDistance") || 0);
            const rawTime = parseInt(localStorage.getItem("elapsedTime") || "0", 10);

            //const totalHours = (rawTime / 3600).toFixed(4); 
            //const distanceMetersString = rawDistance.toFixed(2);

            // 3. Prepare data for LOGGING (in km and hours)
            const distanceInKm = (rawDistance / 1000).toFixed(2); // Convert meters to km
            const timeInHours = (rawTime / 3600).toFixed(2);       

            console.log(`Sending Data: Dist=${distanceInKm}Km, Time=${timeInHours}s, Loc=${location}`);
            const response = await saveHikeStats( 
                currentUser.id,
                distanceInKm,
                location,
                timeInHours

            )

            console.log("Hike stats saved:", response);

            if(response.message && response.message.includes("saved successfully")){

                await updateHikeStatus(hikeid,currentUser.id,"completed");

                localStorage.removeItem("elapsedTime");
                localStorage.removeItem("isTimerRunning");
                localStorage.removeItem("startTime");
                localStorage.removeItem("realTimeDistance");
            
                // Reset component state
                setRealTimeDistance(0);
                setElapsedTime(0);
                alert("Hike successfully completed and stats saved!");
                //deleteUserCompletedHike();
                
                navigate(-1); // Go back to previous page


            }else{
                 alert("Hike saved, but something went wrong.");
            }

        }catch(err){
            console.error("Error saving hike stats:", err);
            alert("Failed to save hike stats. Check console for details.");
        }
    }

  // Effect 4: Fetch initial data (FIX #4: removed duplicate map call)
  useEffect(() => {
    if (!authLoading) {
      fetchStartCoordinates();
      fetchGoals();
      fetchNotes();
console.log("The location is", location);
      fetchWeather();

      if (!mapData) {
        handleMap(hikeid, currentUser.id);
      }
    }
  }, [currentUser, authLoading]);

  if (loading || authLoading)
    return <p className="text-center mt-10">Loading hike info...</p>;
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
            {mapData ? (
              <RouteTracker routeGeoJSON={mapData} className="w-full h-[420px]" />
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
                  <span className="font-medium">Location:</span>
                  <span className="ml-auto">{location}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Map size={20} className="text-blue-500" />
                  <span className="font-medium">Distance:</span>
                  <span className="ml-auto">{(realTimeDistance / 1000).toFixed(2)} km</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock size={20} className="text-green-500" />
                  <span className="font-medium">Time:</span>
                  <span className="ml-auto">{formatTime(elapsedTime)}</span>
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
                <li className="flex items-center gap-3">
                  <Thermometer size={20} className="text-purple-500" />
                  <span className="font-medium">Weather:</span>
                  <span className="ml-auto">{weather ? `${weather.temperature }°C - ${weather.description}` : "Loading..."}</span>
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
              <button
                onClick={handleStartPause}
                className={`flex-1 ${
                  isTimerRunning
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-green-500 hover:bg-green-600"
                } text-white py-2 rounded-lg font-semibold transition`}
              >
                {isTimerRunning ? "Pause Time" : "Start Time"}
              </button>
                <button
                    onClick={() => SaveHike()}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2
                        rounded-lg            
                        font-semibold transition"
                >
                Complete
              </button>
            </div>
          </div>
        </div>

        {/* Elevation Profile */}
        <div className="max-w-6xl mx-auto px-6 py-8 lg:col-span-8 bg-slate-100 dark:bg-slate-1000 rounded-xl overflow-hidden shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Elevation Profile
          </h2>
          <ElevationProfile routeGeoJSON={mapData} />
        </div>
      </div>

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-96 max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={() => setShowNotesModal(false)}
              className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-gray-900"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Notes
            </h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="e.g., Spotted fresh kudu tracks near the river."
                className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <button
                onClick={handleAddNote}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Add
              </button>
            </div>
            <ul className="space-y-2">
              {notesList.length === 0 && (
                <li className="text-gray-500 dark:text-gray-400">No notes yet.</li>
              )}
              {notesList.map((n, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center p-2 rounded bg-gray-100 dark:bg-gray-900"
                >
                  <div>
                    <span className="text-gray-800 dark:text-gray-200">{n.text}</span>
                    <br />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(n.date).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveNote(n)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Goals Modal */}
      {showGoalsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-96 max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={() => setShowGoalsModal(false)}
              className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-gray-900"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Goals
            </h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="e.g., Reach the summit by noon, Take photos at viewpoint..."
                className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
              <button
                onClick={handleAddGoal}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Add
              </button>
            </div>
            <ul className="space-y-2">
              {goalsList.length === 0 && (
                <li className="text-gray-500 dark:text-gray-400">No goals yet.</li>
              )}
              {goalsList.map((g, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center p-2 rounded bg-gray-100 dark:bg-gray-900"
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={g.status === "complete"}
                      onChange={() => handleToggleGoal(g)}
                      className="form-checkbox h-5 w-5 text-green-500"
                    />
                    <span className="text-gray-800 dark:text-gray-200">{g.goal}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Current;