import React, { useMemo, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import * as turf from "@turf/turf";

export default function ElevationProfile({
  routeGeoJSON,
  className = "w-full h-64",
}) {
  const [userPoint, setUserPoint] = useState(null);
  const [watchId, setWatchId] = useState(null);

  const elevationData = useMemo(() => {
    if (!routeGeoJSON?.features?.length) return [];

    const coords = routeGeoJSON.features.flatMap((f) =>
      f.geometry.type === "LineString"
        ? f.geometry.coordinates
        : f.geometry.type === "MultiLineString"
        ? f.geometry.coordinates.flat()
        : []
    );

    let dist = 0;
    return coords.map((c, i) => {
      if (i > 0) {
        const seg = turf.lineString([coords[i - 1], coords[i]]);
        dist += turf.length(seg, { units: "kilometers" });
      }
      return {
        lng: c[0],
        lat: c[1],
        distance: dist, 
        elevation: c[2] || 0,
      };
    });
  }, [routeGeoJSON]);


  useEffect(() => {
    if (!elevationData.length) return;

    const routeLine = turf.lineString(
      elevationData.map((p) => [p.lng, p.lat])
    );

    const updateUserPosition = (pos) => {
      const lng = pos.coords.longitude;
      const lat = pos.coords.latitude;


      const snapped = turf.nearestPointOnLine(routeLine, turf.point([lng, lat]));
      const snappedDist = turf.length(
        turf.lineSlice(routeLine.geometry.coordinates[0], snapped, routeLine),
        { units: "kilometers" }
      );


      const closest = elevationData.reduce((prev, curr) =>
        Math.abs(curr.distance - snappedDist) < Math.abs(prev.distance - snappedDist)
          ? curr
          : prev
      );

      setUserPoint(closest);
    };

    const id = navigator.geolocation.watchPosition(updateUserPosition, console.error, {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 20000,
    });
    setWatchId(id);

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [elevationData]);

  return (
    <div className={`relative ${className}`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={elevationData}>
            <XAxis
              dataKey="distance"
              tickFormatter={(d) => `${d.toFixed(1)} km`}
              stroke="#888"
              tick={{ fontSize: 12, fill: "#666" }}
            />
            <YAxis
              dataKey="elevation"
              stroke="#888"
              tick={{ fontSize: 12, fill: "#666" }}
              label={{
                value: "Elevation (m)",
                angle: -90,
                position: "insideLeft",
                fill: "#666",
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.9)",
                borderRadius: "0.5rem",
                border: "1px solid #ddd",
              }}
            />
            <Line
              type="monotone"
              dataKey="elevation"
              stroke="blue"
              dot={false}
              strokeWidth={2}
            />
            {userPoint && (
              <ReferenceDot
                x={userPoint.distance}
                y={userPoint.elevation}
                r={6}
                fill="#007aff"
                stroke="white"
                strokeWidth={2}
                ifOverflow="hidden"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
    </div>
  );
}