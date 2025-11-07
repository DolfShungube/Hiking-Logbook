import { useState } from "react";
import { UserAuth } from "../context/AuthContext.jsx";
import { hikeDataCollection } from "../context/hikeDataContext.jsx";
import React, { useEffect } from "react";

const mockData = {
  allTime: {
    distance: [
      { name: "Alice", value: 268 },
      { name: "Bob", value: 223 },
      { name: "Charlie", value: 240 },
    ],
    elevation: [
      { name: "Bob", value: 6700 },
      { name: "Alice", value: 6100 },
      { name: "Charlie", value: 5000 },
    ],
    hours: [
      { name: "Charlie", value: 25 },
      { name: "Alice", value: 19 },
      { name: "Bob", value: 21 },
    ],
  },
};

export default function Leaderboard() {
  const [stat, setStat] = useState("distance");
  const {session, currentUser }= UserAuth();
  const { getCompletedHikesData } = hikeDataCollection();

  // const fetchData = async () => {
  //   try {
  //     const data = await getCompletedHikesData(currentUser.id);
  //     console.log("Completed hikes:", data);
  //   } catch (err) {
  //     console.error("Error fetching hikes:", err);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const [completedHikes, setCompletedHikes] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCompletedHikesData(currentUser.id);
        setCompletedHikes(data); // store result in state
        console.log("Completed hikes:", data);
      } catch (err) {
        console.error("Error fetching hikes:", err);
      }
    };

    fetchData();
  }, [currentUser.id]);

  const leaderboard = mockData.allTime[stat];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-6 text-center">
          🌍 All-Time Leaderboard
        </h1>

        {/* Stat Selector */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <select
            value={stat}
            onChange={(e) => setStat(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm"
          >
            <option value="distance">Distance (km)</option>
            <option value="elevation">Elevation (m)</option>
            <option value="hours">Hours Hiked</option>
          </select>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="p-4">Rank</th>
                <th className="p-4">Name</th>
                <th className="p-4">{statLabel(stat)}</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, i) => (
                <tr
                  key={entry.name}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 font-semibold text-blue-600">#{i + 1}</td>
                  <td className="p-4">{entry.name}</td>
                  <td className="p-4 font-medium">{entry.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function statLabel(stat) {
  switch (stat) {
    case "distance":
      return "Distance (km)";
    case "elevation":
      return "Highest Elevation (m)";
    case "hours":
      return "Hours Hiked";
    default:
      return "Value";
  }
}