import React, { useMemo, useState } from "react";
import { UserAuth } from "../context/AuthContext.jsx";
import { useLeaderboard } from "../hooks/use-leaderboard.jsx";

export default function Leaderboard() {
  const { currentUser } = UserAuth();
  const { leaderboardData, loading, error } = useLeaderboard(currentUser?.id);

  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("count");

  const categoryLabels = {
    all: "🥾All-Time",
    week: "📅This Week",
    month: "🗓️This Month",
  };

  const leaderboard = useMemo(() => {
    return Object.values(leaderboardData).sort(
      (a, b) => b.stats[category][sortBy] - a.stats[category][sortBy]
    );
  }, [leaderboardData, category, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <div className="max-w-2xl mx-auto">

        {/* Dynamic heading */}
        <h1 className="text-3xl font-bold mb-4 text-center">
          {categoryLabels[category]}
        </h1>

        {/* Tabs */}
        <div className="flex gap-3 justify-center mb-6">
          {["all", "week", "month"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg transition ${
                category === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex gap-3 justify-center mb-6">
          {[
            { key: "count", label: "Hikes" },
            { key: "dist", label: "Distance" },
            { key: "hours", label: "Hours" },
            { key: "elev", label: "Elevation" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`px-3 py-1 rounded ${
                sortBy === key ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading && <p className="text-center">Loading leaderboard...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-left">
                  <th className="p-4">Rank</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Hikes</th>
                  <th className="p-4">Distance (km)</th>
                  <th className="p-4">Hours</th>
                  <th className="p-4">Elevation (m)</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, i) => (
                  <tr key={entry.id} className="border-t hover:bg-gray-50">
                    <td className="p-4 font-semibold text-blue-600">#{i + 1}</td>
                    <td className="p-4">{entry.name}</td>
                    <td className="p-4">{entry.stats[category].count}</td>
                    <td className="p-4">{entry.stats[category].dist.toFixed(1)}</td>
                    <td className="p-4">{entry.stats[category].hours.toFixed(1)}</td>
                    <td className="p-4">{entry.stats[category].elev}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}