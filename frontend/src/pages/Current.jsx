import React, { useEffect, useState } from 'react';
import { MapPinned, NotebookPen, Flag, Users, Clock, Map, Activity, X } from 'lucide-react';
import RouteTracker from '../components/map.jsx';
import { useParams } from 'react-router-dom';
import { hikeDataCollection } from '../context/hikeDataContext.jsx';
import { RouteDataCollection } from '../context/MapRoutesContext.jsx';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});

const Current = () => {
  const [showNotes, setShowNotes] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [notes, setNotes] = useState("");
  const [goals, setGoals] = useState(["Reach summit", "Take photos at viewpoint"]);
  const [mapData, setMapData] = useState(null);

  const [coords, setCoords] = useState(null);             // Hike start coordinates
  const [currentCoords, setCurrentCoords] = useState(null); // User's live coordinates
  const [realTimeDistance, setRealTimeDistance] = useState(0);

  const [error, setError] = useState(null);
  const { hikeid } = useParams();
  const { getHike } = hikeDataCollection();
  const { getRouteJson } = RouteDataCollection();

  const friends = [
    { id: 1, name: "Albert Flores", status: "Online", avatar: "https://i.pravatar.cc/100?img=11" },
    { id: 2, name: "Sofia Carter", status: "Online", avatar: "https://i.pravatar.cc/100?img=16" },
  ];

  const addGoal = (goal) => {
    if (goal.trim() !== "") setGoals([...goals, goal.trim()]);
  };

  const removeGoal = (idx) => setGoals(goals.filter((_, i) => i !== idx));

  const handleMap = async (hike_id) => {
    const res = await getHike(hike_id);
    const routeid = res[0]?.route || null;
    if (routeid) {
      const data = await getRouteJson(routeid);
      if (data[0]) setMapData(data[0]?.path || null);
    }
  };

  const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (user) return user.id;
    if (error) console.log("User not found");
  };

  const fetchStartCoordinates = async () => {
    try {
      const userid = await getCurrentUser();
      // Replace getCoordinates with your actual function to fetch user's hike start
      const coordsData = await getCoordinates(userid); 
      if (coordsData && coordsData.start) {
        const startCoords = {
          lat: coordsData.start[1],
          lon: coordsData.start[0],
        };
        console.log("Start coordinates:", startCoords);
        setCoords(startCoords);
      } else {
        console.log("No start coordinates found");
      }
    } catch (err) {
      console.log("Error fetching start coordinates:", err);
    }
  };

  // Calculate distance in meters
  function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth radius in meters
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(deltaPhi / 2) ** 2 +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Fetch start coordinates when component mounts
  useEffect(() => {
    fetchStartCoordinates();
  }, []);

  // Watch the user's location in real-time
  useEffect(() => {
    if (!coords) return; // wait until start coordinates are ready

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newCoords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        setCurrentCoords(newCoords);
        console.log("Current coordinates:", newCoords);

        // Calculate distance
        const distance = getDistanceFromLatLonInMeters(
          coords.lat,
          coords.lon,
          newCoords.lat,
          newCoords.lon
        );
        console.log("Distance in meters:", distance);
        setRealTimeDistance(distance);
      },
      (err) => console.log(err),
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [coords]);

  useEffect(() => {
    if (!mapData) handleMap(hikeid);
  }, [hikeid]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Your Current Hike</h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Map */}
          <div className="lg:col-span-8 bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden shadow-lg">
            {mapData
              ? <RouteTracker routeGeoJSON={mapData} className="w-full h-[420px]" />
              : <p className="text-center text-gray-500">Loading map...</p>
            }
          </div>

          {/* Trail Info */}
          <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg flex flex-col justify-between transition-all hover:shadow-xl">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 border-b pb-2 border-gray-200 dark:border-gray-700">Trail Info</h3>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-3">
                  <Map size={20} className="text-blue-500 dark:text-blue-400" />
                  <span className="font-medium">Distance:</span>
                  <span className="ml-auto">
                    {realTimeDistance ? (realTimeDistance / 1000).toFixed(2) + " km" : "Calculating..."}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock size={20} className="text-green-500 dark:text-green-400" />
                  <span className="font-medium">Time:</span>
                  <span className="ml-auto">3 hrs</span>
                </li>
                <li className="flex items-center gap-3">
                  <Activity size={20} className="text-red-500 dark:text-red-400" />
                  <span className="font-medium">Difficulty:</span>
                  <span className="ml-auto">Moderate</span>
                </li>
                <li className="flex items-center gap-3">
                  <MapPinned size={20} className="text-purple-500 dark:text-purple-400" />
                  <span className="font-medium">Duration:</span>
                  <span className="ml-auto">2 hrs left</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Current;
