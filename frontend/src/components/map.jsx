import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";

mapboxgl.accessToken = "pk.eyJ1IjoiZS0wMDEiLCJhIjoiY21ldTA1MjNvMDF2azJscjA3a293dHJoNyJ9.CJN52YWxqsYFjz2K9sy3Zw";

// --- Helper: normalize route for Turf (handles MultiLineString + LineString, strips Z) ---
import { normalizeRoute } from "../utils/mapUtils";
import { addRouteLayers, addStartEndMarkers, addUserLayer,addDirectionLineLayer,addTrailLine } from "../utils/mapLayer";
import { trackUserPosition } from "../utils/geolocation";

function RouteTracker({ routeGeoJSON, className = "w-full h-screen" }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const trailCoordsRef = useRef([]);
  const lastCoordsRef = useRef(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, duration = 3000) => {
    setToast(msg);
    setTimeout(() => setToast(null), duration);
  };

  useEffect(() => {
    if (mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [0, 0],
      zoom: 13,
      attributionControl: true
    });
    mapRef.current = map;

    map.on("load", () => {
      if (routeGeoJSON?.features?.length) {
        const routeLine = normalizeRoute(routeGeoJSON);
        const coords = routeLine.geometry.coordinates;
        addRouteLayers(map, routeGeoJSON);
        addStartEndMarkers(map, coords);
        addDirectionLineLayer(map)
      }
      addUserLayer(map);
      addTrailLine(map);

      if (navigator.geolocation) {
        const cleanup = trackUserPosition(trailCoordsRef,map, routeGeoJSON, () => showToast("⚠️ You are leaving the route!"));
        return cleanup;
      }
    });
  }, [routeGeoJSON]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full" />
      {toast && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
export default RouteTracker;