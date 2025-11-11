import React, { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext.jsx";
import { hikeDataCollection } from "../context/hikeDataContext.jsx";
import { UserDataCollection } from "../context/UsersContext.jsx";
import { friendDataCollection } from "../context/FriendsContext.jsx";

const mockData = {
  user1: { name: "Alice", hikes: 42 },
  user2: { name: "Bob", hikes: 37 },
  user3: { name: "Charlie", hikes: 33 },
  user4: { name: "Dana", hikes: 29 },
};

export default function Leaderboard() {
  const [leaderboardStatsByUser, setLeaderboardStatsByUser] = useState({});
  const {session, currentUser }= UserAuth();
  const { getCompletedHikesData } = hikeDataCollection();
  const { getUser } = UserDataCollection();

  const { getUsersFriends } = friendDataCollection();
  const [friends, setFriends] = useState([]);

  const fetchFriends = async (userId) => {
    try {
      const data = await getUsersFriends(userId);
      
      const friend_list = data.friend_list.friends;
      setFriends(friend_list);
      
      console.log(`Friends for ${userId}:`, friend_list);
    } catch (err) {
      console.error("Failed to load friends:", err);
    }
  };
  
  const fetchData = async (userId) => {
    try {
      const { data, error } = await getCompletedHikesData(userId);
      if (error) throw error;

      const numCompletedHikes = Array.isArray(data) ? data.length : 0;

      const userData = await getUser(userId);
      const username = userData.name;

      setLeaderboardStatsByUser((prev) => ({
        ...prev,
        [userId]: {
          name: username,
          hikes: numCompletedHikes,
        },
      }));

      console.log(`Completed hikes for ${userId}:`, data);
    } catch (err) {
      console.error(`Error fetching data for ${userId}:`, err);
    }
  };

  // Fetch Friends List
  useEffect(() => {
    if (currentUser?.id) fetchFriends(currentUser?.id);
  }, [currentUser?.id, getUsersFriends]);

  // Example: automatically fetch for current user
  useEffect(() => {
    if (currentUser?.id) {
      fetchData(currentUser.id);
    }
  }, [currentUser?.id]);

  // Log Changes to leaderboardStatsByUser
  useEffect(() => {
    console.log("leaderboardStatsByUser updated:", leaderboardStatsByUser);
  }, [leaderboardStatsByUser])

  // Convert object to array and sort by hikes descending
  const leaderboard = Object.values(leaderboardStatsByUser).sort(
    (a, b) => b.hikes - a.hikes
  );
  // const leaderboard = Object.values(mockData).sort(
  //   (a, b) => b.hikes - a.hikes
  // );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-8 text-center">
          🥾 All-Time Hikes Completed
        </h1>

        {/* Leaderboard Table */}
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