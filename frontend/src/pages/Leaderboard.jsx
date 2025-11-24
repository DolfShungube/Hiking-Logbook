import React, { useMemo, useState } from "react";
import { UserAuth } from "../context/AuthContext.jsx";
import { useLeaderboard } from "../hooks/use-leaderboard.jsx";

export default function Leaderboard() {
  const { currentUser } = UserAuth();
  const { leaderboardData, loading, error } = useLeaderboard(currentUser?.id);

  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("count");
  const [sortDir, setSortDir] = useState("desc");

  const categoryLabels = {
    all: "🥾All-Time",
    week: "📅This Week",
    month: "🗓️This Month",
  };

  const sortKeys = [
    { key: "count", label: "Hikes" },
    { key: "dist", label: "Distance (km)" },
    { key: "hours", label: "Hours" },
    { key: "elev", label: "Elevation (m)" },
  ];

  const handleSort = (key) => {
    if (key === sortBy) {
      // toggle direction
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("desc");
    }
  };

  const leaderboard = useMemo(() => {
    return Object.values(leaderboardData).sort((a, b) => {
      const valA = a.stats[category][sortBy];
      const valB = b.stats[category][sortBy];
      return sortDir === "desc" ? valB - valA : valA - valB;
    });
  }, [leaderboardData, category, sortBy, sortDir]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">
          {categoryLabels[category]}
        </h1>

        {/* Category Tabs */}
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

        {loading && <p className="text-center">Loading leaderboard...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-left select-none">
                  <th className="p-4">Rank</th>
                  <th className="p-4">Name</th>

                  {sortKeys.map(({ key, label }) => (
                    <th
                      key={key}
                      className="p-4 cursor-pointer hover:underline"
                      onClick={() => handleSort(key)}
                    >
                      {label}
                      {sortBy === key && (
                        <span className="ml-1">
                          {sortDir === "desc" ? "▼" : "▲"}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {leaderboard.map((entry, i) => (
                  <tr key={entry.id} className="border-t hover:bg-gray-50">
                    <td className="p-4 font-semibold text-blue-600">
                      #{i + 1}
                    </td>
                    <td className="p-4">{entry.name}</td>

                    <td className="p-4">{entry.stats[category].count}</td>
                    <td className="p-4">
                      {entry.stats[category].dist.toFixed(1)}
                    </td>
                    <td className="p-4">
                      {entry.stats[category].hours.toFixed(1)}
                    </td>
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