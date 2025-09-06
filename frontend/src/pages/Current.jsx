import React, { useEffect, useState } from 'react';
import { MapPinned, Clock, Activity, Map } from 'lucide-react';
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
  const [mapData, setMapData] = useState(null);
  const [coords, setCoords] = useState(null);
  const [currentCoords, setCurrentCoords] = useState(null);
  const [realTimeDistance, setRealTimeDistance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [difficulty,setDifficulty] = useState(null);

  const { hikeid } = useParams();
  const { getHike, getCoordinates } = hikeDataCollection();
  const { getRouteJson } = RouteDataCollection();

  // Fetch current user ID from Supabase
  const getCurrentUserId = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.id;
    } catch (err) {
      console.error("Error getting user:", err);
      setError("Could not get current user");
      return null;
    }
  };

  // Fetch start coordinates from backend
  const fetchStartCoordinates = async () => {
    try {
      const userid = await getCurrentUserId();
      if (!userid) return;

      console.log("Fetching coordinates for user:", userid);

      const coordsData = await getCoordinates(userid);
      if (!coordsData || !coordsData.start) {
        console.warn("No start coordinates found");
        setError("No start coordinates found");
        return;
      }

      const startCoords = {
        lat: coordsData.start[1],
        lon: coordsData.start[0],
      };
      console.log("Start coordinates:", startCoords);
      setCoords(startCoords);

     
     
      setDifficulty(coordsData.difficulty);


    } catch (err) {
      console.error("Error fetching start coordinates:", err);
      setError("Error fetching start coordinates");
    } finally {
      setLoading(false);
    }
  };

  // Calculate distance in meters between two coordinates
  const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth radius in meters
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(deltaPhi / 2) ** 2 +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Fetch map route
  const fetchMapData = async () => {
    try {
      if (!hikeid) return;
      const hike = await getHike(hikeid);
      const routeId = hike?.[0]?.route;
      if (!routeId) return;

      const routeData = await getRouteJson(routeId);
      if (routeData?.[0]?.path) setMapData(routeData[0].path);
    } catch (err) {
      console.error("Error fetching map data:", err);
      setError("Error fetching map data");
    }
  };

  // Watch user position in real-time
  useEffect(() => {
    if (!coords) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newCoords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        setCurrentCoords(newCoords);

        const distance = getDistanceFromLatLonInMeters(
          coords.lat,
          coords.lon,
          newCoords.lat,
          newCoords.lon
        );
        setRealTimeDistance(distance);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Could not get current location");
      },
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 20000  }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [coords]);

  // Fetch start coordinates when component mounts
  useEffect(() => {
    fetchStartCoordinates();
    fetchMapData();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading hike info...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

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
                  <span className="ml-auto">{difficulty || "Loading..."}</span>
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
