import { useState, useEffect, useCallback, useMemo } from "react";
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

  /** Pre-compute date thresholds (memoized) */
  const { oneWeekAgo, oneMonthAgo } = useMemo(() => {
    const month = new Date();
    month.setMonth(month.getMonth() - 1);

    const week = new Date();
    week.setDate(week.getDate() - 7);

    return { oneWeekAgo: week, oneMonthAgo: month };
  }, []);

  /** Shared helper for calculating duration */
  const calculateHours = useCallback((start, end) => {
    return (new Date(end) - new Date(start)) / 36e5;
  }, []);

  /** Fetch ONE user’s stats */
  const fetchUserStats = useCallback(async (userId) => {
    try {
      const { data, error } = await getCompletedHikesData(userId);
      if (error) throw error;

      const user = await getUser(userId);

      // Pre-parse dates once
      const hikes = data.map((h) => ({
        ...h,
        start: new Date(h.startdate),
        end: new Date(h.enddate),
      }));

      // Unified stats object
      const stats = {
        all: { count: 0, hours: 0, dist: 0, elev: 0 },
        week: { count: 0, hours: 0, dist: 0, elev: 0 },
        month: { count: 0, hours: 0, dist: 0, elev: 0 },
      };

      for (const h of hikes) {
        const dur = calculateHours(h.start, h.end);

        // All time
        stats.all.count++;
        stats.all.hours += dur;
        stats.all.dist += h.distance;
        stats.all.elev += h.elevation;

        // Last Week
        if (h.end >= oneWeekAgo) {
          stats.week.count++;
          stats.week.hours += dur;
          stats.week.dist += h.distance;
          stats.week.elev += h.elevation;
        }

        // Last Month
        if (h.end >= oneMonthAgo) {
          stats.month.count++;
          stats.month.hours += dur;
          stats.month.dist += h.distance;
          stats.month.elev += h.elevation;
        }
      }

      console.log("User:", userId);
      console.log("Username:", user.name);
      console.log("Stats:", stats);

      return {
        id: userId,
        name: user.name,
        stats: stats,
      };
    } catch (err) {
      console.error(`Failed fetching stats for ${userId}:`, err);
      return null;
    }
  }, [getCompletedHikesData, getUser, calculateHours, oneWeekAgo, oneMonthAgo]);

  /** Fetch the current user + all friends */
  const fetchLeaderboard = useCallback(async () => {
    if (!currentUserId) return;

    try {
      setLoading(true);

      const friendsData = await getUsersFriends(currentUserId);
      const friendIds = friendsData?.friend_list?.friends ?? [];

      const allIds = [currentUserId, ...friendIds];
      const results = await Promise.all(allIds.map(fetchUserStats));

      setLeaderboardData(
        Object.fromEntries(results.filter(Boolean).map((u) => [u.id, u]))
      );

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
    refresh: fetchLeaderboard,
  };
}