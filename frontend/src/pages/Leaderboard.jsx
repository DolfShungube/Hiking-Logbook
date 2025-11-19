import React, { useState, useEffect, useMemo, useCallback } from "react";
import { UserAuth } from "../context/AuthContext.jsx";
import { hikeDataCollection } from "../context/hikeDataContext.jsx";
import { UserDataCollection } from "../context/UsersContext.jsx";
import { friendDataCollection } from "../context/FriendsContext.jsx";

export default function Leaderboard() {
  const [leaderboardStatsByUser, setLeaderboardStatsByUser] = useState({});

  const { getCompletedHikesData } = hikeDataCollection();
  const { getUsersFriends } = friendDataCollection();
  const { session, currentUser } = UserAuth();
  const { getUser } = UserDataCollection();

  /** ---------------------------------------------
   * Fetch stats for ONE user
   * --------------------------------------------- */
  const fetchData = useCallback(async (userId) => {
    try {
      const { data, error } = await getCompletedHikesData(userId);
      if (error) throw error;

      const numCompletedHikes = Array.isArray(data) ? data.length : 0;

      const userData = await getUser(userId);

      return {
        id: userId,
        name: userData.name,
        hikes: numCompletedHikes,
      };
    } catch (err) {
      console.error(`Error fetching data for ${userId}:`, err);
      return null;
    }
  }, [getCompletedHikesData, getUser]);

  /** ---------------------------------------------
   * Fetch the current user + their friends in one go
   * --------------------------------------------- */
  const fetchAllLeaderboardData = useCallback(async (userId) => {
    try {
      const friendsData = await getUsersFriends(userId);
      const friends = friendsData?.friend_list?.friends ?? [];

      // Include the user themselves
      const allIds = [userId, ...friends];

      const results = await Promise.all(allIds.map((id) => fetchData(id)));

      const newStats = {};
      results.forEach((entry) => {
        if (entry) newStats[entry.id] = entry;
      });

      setLeaderboardStatsByUser(newStats);
    } catch (err) {
      console.error("Failed to load leaderboard data:", err);
    }
  }, [fetchData, getUsersFriends]);

  /** ---------------------------------------------
   * Load leaderboard when the logged-in user is ready
   * --------------------------------------------- */
  useEffect(() => {
    if (currentUser?.id) {
      fetchAllLeaderboardData(currentUser.id);
    }
  }, [currentUser?.id, fetchAllLeaderboardData]);

  /** ---------------------------------------------
   * Memoize sorted leaderboard
   * --------------------------------------------- */
  const leaderboard = useMemo(() => {
    return Object.values(leaderboardStatsByUser).sort(
      (a, b) => b.hikes - a.hikes
    );
  }, [leaderboardStatsByUser]);

  /** ---------------------------------------------
   * UI
   * --------------------------------------------- */
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          🥾 All-Time Hikes Completed
        </h1>

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
                <tr
                  key={entry.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 font-semibold text-blue-600">#{i + 1}</td>
                  <td className="p-4">{entry.name}</td>
                  <td className="p-4 font-medium">{entry.hikes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}