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

      const allTimeHikes = data;
      const pastWeekHikes = data.filter(item => new Date(item.enddate) >= oneWeekAgo);
      const pastMonthHikes = data.filter(item => new Date(item.enddate) >= oneMonthAgo);

      function calculateDuration(hike) {
        const start = new Date(hike.startdate);
        const end = new Date(hike.enddate);
        return (end - start) / (1000 * 60 * 60); // hours
      }

      const totalHours = allTimeHikes.reduce((sum, hike) => sum + calculateDuration(hike), 0);
      const totalWeekHours = pastWeekHikes.reduce((sum, hike) => sum + calculateDuration(hike), 0);
      const totalMonthHours = pastMonthHikes.reduce((sum, hike) => sum + calculateDuration(hike), 0);

      const totalDistance = allTimeHikes.reduce((sum, hike) => sum + hike.distance, 0);
      const totalWeekDistance = pastWeekHikes.reduce((sum, hike) => sum + hike.distance, 0);
      const totalMonthDistance = pastMonthHikes.reduce((sum, hike) => sum + hike.distance, 0);

      const totalElevation = allTimeHikes.reduce((sum, hike) => sum + hike.elevation, 0);
      const totalWeekElevation = pastWeekHikes.reduce((sum, hike) => sum + hike.elevation, 0);
      const totalMonthElevation = pastMonthHikes.reduce((sum, hike) => sum + hike.elevation, 0);

      const user = await getUser(userId);

      console.log("User:", userId);
      console.log("Username:", user.name);
      console.log("Data:", data);
      console.log("All time hikes:", allTimeHikes.length);
      console.log("Total hours all time:", totalHours);
      console.log("Total distance all time:", totalDistance);
      console.log("Total elevation all time:", totalElevation);
      console.log("Past week hikes:", pastWeekHikes.length);
      console.log("Total hours past week:", totalWeekHours);
      console.log("Total distance past week:", totalWeekDistance);
      console.log("Total elevation past week:", totalWeekElevation);
      console.log("Past month hikes:", pastMonthHikes.length);
      console.log("Total hours past month:", totalMonthHours);
      console.log("Total distance past month:", totalMonthDistance);
      console.log("Total elevation past month:", totalMonthElevation);

      return {
        id: userId,
        name: user.name,
        hikes: allTimeHikes.length,
        totalHours: totalHours,
        totalDistance: totalDistance,
        totalElevation: totalElevation,
        hikesPastWeek: pastWeekHikes.length,
        totalHoursPastWeek: totalWeekHours,
        totalDistancePastWeek: totalWeekDistance,
        totalElevationPastWeek: totalWeekElevation,
        hikesPastMonth: pastMonthHikes.length,
        totalHoursPastMonth: totalMonthHours,
        totalDistancePastMonth: totalMonthDistance,
        totalElevationPastMonth: totalMonthElevation,
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