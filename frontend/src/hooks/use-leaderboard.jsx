import { useState, useEffect, useCallback } from "react";
import { hikeDataCollection } from "../context/hikeDataContext.jsx";
import { UserDataCollection } from "../context/UsersContext.jsx";
import { friendDataCollection } from "../context/FriendsContext.jsx";

export function useLeaderboard(currentUserId) {
  const [leaderboardData, setLeaderboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { getCompletedHikesData } = hikeDataCollection();
  const { getUsersFriends } = friendDataCollection();
  const { getUser } = UserDataCollection();

  /** Fetch ONE user’s stats */
  const fetchUserStats = useCallback(async (userId) => {
    try {
      const { data, error } = await getCompletedHikesData(userId);
      if (error) throw error;

      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const hikesLastMonth = Array.isArray(data)
      ? data.filter(hike => new Date(hike.enddate) >= oneMonthAgo)
      : [];

      const hikesLastWeek = Array.isArray(data)
      ? data.filter(hike => new Date(hike.enddate) >= oneWeekAgo)
      : [];

      const numHikes = Array.isArray(data) ? data.length : 0;
      const numHikesLastMonth = hikesLastMonth.length;
      const numHikesLastWeek = hikesLastWeek.length;
      
      const user = await getUser(userId);

      // console.log("Fetched hikes data for", userId, hikesLastMonth);

      return {
        id: userId,
        name: user.name,
        hikes: numHikes,
        hikesLastMonth: numHikesLastMonth,
        hikesLastWeek: numHikesLastWeek,
      };
    } catch (err) {
      console.error(`Failed fetching stats for ${userId}:`, err);
      return null;
    }
  }, [getCompletedHikesData, getUser]);

  /** Fetch the current user + all friends */
  const fetchLeaderboard = useCallback(async () => {
    if (!currentUserId) return;

    try {
      setLoading(true);

      const friendsData = await getUsersFriends(currentUserId);
      const friendIds = friendsData?.friend_list?.friends ?? [];

      const allIds = [currentUserId, ...friendIds];
      const results = await Promise.all(allIds.map(fetchUserStats));

      const mapped = {};
      results.forEach((entry) => {
        if (entry) mapped[entry.id] = entry;
      });

      setLeaderboardData(mapped);
      setError(null);
    } catch (err) {
      console.error("Leaderboard fetch failed:", err);
      setError("Failed to load leaderboard.");
    } finally {
      setLoading(false);
    }
  }, [currentUserId, fetchUserStats, getUsersFriends]);

  /** Auto-fetch when currentUserId changes */
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return {
    leaderboardData,
    loading,
    error,
    refresh: fetchLeaderboard, // expose manual refresh if needed
  };
}