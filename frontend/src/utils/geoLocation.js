import * as turf from "@turf/turf";
import { normalizeRoute } from "./mapUtils";
import { useRef } from "react";

export const lastUserCoordsRef = { current: null };

export function trackUserPosition(
  trailCoordsRef,
  map,
  routeGeoJSON,
  onOffRoute, // may be null in preview mode
  onFirstFix,
  isTracking
) {
  const hasRoute = !!routeGeoJSON?.features?.length;
  let firstFixDone = false;

  const handlePosition = (pos) => {
    const gpsCoords = [pos.coords.longitude, pos.coords.latitude];
    let userCoords = gpsCoords;

    if (hasRoute) {
      const routeLine = normalizeRoute(routeGeoJSON);
      const gpsPoint = turf.point(gpsCoords);
      const snapped = turf.nearestPointOnLine(routeLine, gpsPoint);
      userCoords = snapped.geometry.coordinates;

      // Update trail
      trailCoordsRef.current.push(userCoords);
      const trailSource = map.getSource("user-trail");
      if (trailSource) {
        trailSource.setData({
          type: "Feature",
          geometry: { type: "LineString", coordinates: trailCoordsRef.current },
        });
      }

      // ✅ Only call off-route if not in preview
      if (onOffRoute) {
        const distance = turf.pointToLineDistance(gpsPoint, routeLine, { units: "meters" });
        if (distance > 20) onOffRoute();
      }
    }

    // Update marker
    const userSource = map.getSource("user");
    if (userSource) {
      userSource.setData({
        type: "FeatureCollection",
        features: [{ type: "Feature", geometry: { type: "Point", coordinates: userCoords } }],
      });
    }

    // Centering
    if (!firstFixDone) {
      map.jumpTo({ center: userCoords, zoom: 15 });
      firstFixDone = true;
      onFirstFix?.();
    } else if (isTracking()) {
      map.easeTo({ center: userCoords, duration: 1000 });
    }
  };

  navigator.geolocation.getCurrentPosition(handlePosition, console.error, {
    enableHighAccuracy: true,
    maximumAge: 600000,
    timeout: 900000,
  });

  const watchId = navigator.geolocation.watchPosition(
    handlePosition,
    console.error,
    { enableHighAccuracy: true, maximumAge: 600000 }
  );

  return () => navigator.geolocation.clearWatch(watchId);
}
