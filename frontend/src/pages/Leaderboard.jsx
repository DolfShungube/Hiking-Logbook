import React, { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext.jsx";
import { hikeDataCollection } from "../context/hikeDataContext.jsx";
import { UserDataCollection } from "../context/UsersContext.jsx";

const mockData = [
  { name: "Alice", hikes: 42 },
  { name: "Bob", hikes: 37 },
  { name: "Charlie", hikes: 33 },
  { name: "Dana", hikes: 29 },
];

export default function Leaderboard() {
  const [leaderboardStatsByUser, setLeaderboardStatsByUser] = useState({});
  const {session, currentUser }= UserAuth();
  const { getCompletedHikesData } = hikeDataCollection();
  const { getUser } = UserDataCollection();
  
  const fetchData = async (userId) => {
    try {
      const { data, error } = await getCompletedHikesData(userId);
      if (error) throw error;

      const numCompletedHikes = Array.isArray(data) ? data.length : 0;

      // const data2 = await getUser(userId);
      // const username = data2.name;

      setLeaderboardStatsByUser((prev) => ({
        ...prev,
        [userId]: {
          // name: username,
          hikes: data,
          count: numCompletedHikes,
        },
      }));

      console.log(`Completed hikes for ${userId}:`, data);
      // console.log(`Number of completed hikes for ${userId}:`, numCompletedHikes);
      // console.log(`username for ${userId}:`, username);
    } catch (err) {
      console.error(`Error fetching data for ${userId}:`, err);
    }
  };

  // Example: automatically fetch for current user
  useEffect(() => {
    if (currentUser?.id) {
      fetchData(currentUser.id);
    }
  }, [currentUser?.id]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-8 text-center">
          🥾 All-Time Hikes Completed
        </h1>

        {/* Leaderboard */}
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
              {mockData.map((entry, i) => (
                <tr
                  key={entry.name}
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