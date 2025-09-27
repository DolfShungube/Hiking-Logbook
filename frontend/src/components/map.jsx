import React, { useRef, useEffect, useState } from "react";
import { Crosshair, X } from 'lucide-react';
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";

mapboxgl.accessToken = "pk.eyJ1IjoiZS0wMDEiLCJhIjoiY21ldTA1MjNvMDF2azJscjA3a293dHJoNyJ9.CJN52YWxqsYFjz2K9sy3Zw";

// --- Helper: normalize route for Turf (handles MultiLineString + LineString, strips Z) ---
import { normalizeRoute } from "../utils/mapUtils";
import { addRouteLayers, addStartEndMarkers, addUserLayer,addDirectionLineLayer,addTrailLine } from "../utils/mapLayer";
import { trackUserPosition } from "../utils/geolocation";

export const lastUserCoordsRef = { current: null };

function RouteTracker({ 
  routeGeoJSON, 
  className = "w-full h-screen", 
  preview = false // ✅ new prop
}) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const trailCoordsRef = useRef([]);
  const [toast, setToast] = useState(null);
  const [initialCentered, setInitialCentered] = useState(false);
  const [tracking, setTracking] = useState(true);

  const showToast = (msg, duration = 3000) => {
    if (preview) return; // ✅ no toast in preview mode
    setToast(msg);
    setTimeout(() => setToast(null), duration);
  };

  useEffect(() => {
    if (mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [0, 0],
      zoom: 2,
      attributionControl: true,
    });
    mapRef.current = map;

    map.on("load", () => {
      if (routeGeoJSON?.features?.length) {
        const routeLine = normalizeRoute(routeGeoJSON);
        const coords = routeLine.geometry.coordinates;
        addRouteLayers(map, routeGeoJSON);
        addStartEndMarkers(map, coords);
        addDirectionLineLayer(map);
      }
      addTrailLine(map);

      // Pre-add empty user source
      map.addSource("user", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.addLayer({
        id: "user-marker",
        type: "circle",
        source: "user",
        paint: {
          "circle-radius": 8,
          "circle-color": "#007aff",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });

      // Fallback route centering if GPS is slow
      let fallbackTimer;
      if (routeGeoJSON?.features?.length) {
        fallbackTimer = setTimeout(() => {
          if (!initialCentered) {
            const routeLine = normalizeRoute(routeGeoJSON);
            const bounds = turf.bbox(routeLine);
            map.fitBounds(bounds, { padding: 50 });
            setInitialCentered(true);
          }
        }, 4000);
      }

      // Start tracking user
      const cleanup = trackUserPosition(
        trailCoordsRef,
        map,
        routeGeoJSON,
        preview ? null : () => showToast("⚠️ You are leaving the route!"), // ✅ disable off-route warnings in preview
        () => {
          clearTimeout(fallbackTimer);
          setInitialCentered(true);
        },
        () => tracking
      );

      return () => {
        cleanup();
        clearTimeout(fallbackTimer);
      };
    });
  }, [routeGeoJSON, initialCentered, tracking, preview]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full" />

      {/* Toast (hidden in preview mode) */}
      {!preview && toast && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
          {toast}
        </div>
      )}

      {/* Tracking toggle (still works in preview mode) */}
      <button
        onClick={() => setTracking((t) => !t)}
        className="absolute bottom-20 right-4 bg-white dark:bg-slate-800 p-3 rounded-full shadow-lg hover:scale-105 transition"
        title={tracking ? "Disable tracking" : "Enable tracking"}
      >
        {tracking ? (
          <Crosshair className="w-5 h-5 text-blue-600" />
        ) : (
          <X className="w-5 h-5 text-gray-600" />
        )}
      </button>
    </div>
  );
}




export default RouteTracker;