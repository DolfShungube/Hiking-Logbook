import React, { useMemo } from "react";
import { UserAuth } from "../context/AuthContext.jsx";
import { useLeaderboard } from "../hooks/use-leaderboard.jsx";

export default function Leaderboard() {
  const { currentUser } = UserAuth();
  const { leaderboardData, loading, error } = useLeaderboard(currentUser?.id);

  const leaderboard = useMemo(() => {
    return Object.values(leaderboardData).sort(
      (a, b) => b.stats.all.count - a.stats.all.count
    );
  }, [leaderboardData]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          🥾 All-Time Hikes Completed
        </h1>

        {loading && <p className="text-center">Loading leaderboard...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-left">
                  <th className="p-4">Rank</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Hikes Completed</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, i) => (
                  <tr key={entry.id} className="border-t hover:bg-gray-50">
                    <td className="p-4 font-semibold text-blue-600">#{i + 1}</td>
                    <td className="p-4">{entry.name}</td>
                    <td className="p-4 font-medium">{entry.stats.all.count}</td>
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