import React, { useEffect, useState } from "react";
import { MapPinned, Clock, Activity, Map } from "lucide-react";
import RouteTracker from "../components/map.jsx";
import { useParams } from "react-router-dom";
import { hikeDataCollection } from "../context/hikeDataContext.jsx";
import { createClient } from "@supabase/supabase-js";
import "mapbox-gl/dist/mapbox-gl.css"; // Mapbox CSS

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

  const { hikeid } = useParams();
  const { getCoordinates } = hikeDataCollection();

  // Get current user ID
  const getCurrentUserId = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user?.id ?? null;
    } catch (err) {
      console.error("Error getting user:", err);
      setError("Could not get current user");
      return null;
    }
  };

  // Fetch start coordinates and path
  const fetchStartCoordinates = async () => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return;

      const coordsData = await getCoordinates(userId);
      if (!coordsData || !coordsData.start || !coordsData.path) {
        setError("No start coordinates or path found");
        return;
      }

      const startCoords = {
        lat: coordsData.start[1],
        lon: coordsData.start[0],
      };
      setCoords(startCoords);
      setDifficulty(coordsData.difficulty || "Unknown");

      const path = coordsData.path.map(([lat, lon]) => ({ lat, lon }));
      setPathCoords(path);
    } catch (err) {
      console.error("Error fetching coordinates:", err);
      setError("Error fetching start coordinates");
    } finally {
      setLoading(false);
    }
  };

  // Haversine formula
  const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) ** 2 +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Track live user position and calculate distance along path
  useEffect(() => {
    if (!coords || pathCoords.length === 0) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newCoords = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };
        setCurrentCoords(newCoords);

        // Find closest point on path
        let closestIndex = 0;
        let minDist = Infinity;
        pathCoords.forEach((point, idx) => {
          const d = getDistanceFromLatLonInMeters(
            point.lat,
            point.lon,
            newCoords.lat,
            newCoords.lon
          );
          if (d < minDist) {
            minDist = d;
            closestIndex = idx;
          }
        });

        // Sum distances along path up to closestIndex
        let walkedDistance = 0;
        for (let i = 1; i <= closestIndex; i++) {
          walkedDistance += getDistanceFromLatLonInMeters(
            pathCoords[i - 1].lat,
            pathCoords[i - 1].lon,
            pathCoords[i].lat,
            pathCoords[i].lon
          );
        }
        setRealTimeDistance(walkedDistance);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError(
          "Could not get current location. Please allow location access."
        );
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 60000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [coords, pathCoords]);

  useEffect(() => {
    fetchStartCoordinates();
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
            {pathCoords.length > 0 ? (
              <RouteTracker
                routeGeoJSON={pathCoords}
                className="w-full h-[420px]"
                currentPosition={currentCoords}
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
                  <Map size={20} className="text-blue-500 dark:text-blue-400" />
                  <span className="font-medium">Distance:</span>
                  <span className="ml-auto">
                    {(realTimeDistance / 1000).toFixed(2)} km
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
