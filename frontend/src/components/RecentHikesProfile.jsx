import React, { useEffect, useState } from 'react';
import { hikeDataCollection } from '../context/hikeDataContext';
import { UserAuth } from '../context/AuthContext';
import HikeItem from './hikeItem';
import RecentHikeItem from './RecentHikeItem';  
import { useNavigate } from "react-router-dom";

const RecentHikes = ({ type, userId }) => { // Accept userId prop
  const [completedHikes, setCompletedHikes] = useState([]);
  const [currentHike, setCurrentHike] = useState([]);
  const { getCompletedHikesData, getCurrentHikeData } = hikeDataCollection();
  const { currentUser } = UserAuth();
  const [loading, setLoading] = useState(true);
  const table = type === "current" ? currentHike : completedHikes;
  const navigate = useNavigate();

  const HandleCompletedHikes = async (id) => {
    try {
      const data = await getCompletedHikesData(id);
      setCompletedHikes(data?.data || []);
    } catch (err) {
      console.error("Unexpected error (completed hikes):", err);
    }
  };

  const HandleCurrentHike = async (id) => {
    try {
      const data = await getCurrentHikeData(id);
      setCurrentHike(data?.data || []);
    } catch (err) {
      console.error("Unexpected error (current hike):", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // Use the passed userId prop, or fall back to currentUser.id
      const userIdToFetch = userId || currentUser?.id;
      
      if (userIdToFetch) {
        setLoading(true);
        try {
          if (type === "current") {
            await HandleCurrentHike(userIdToFetch);
          } else {
            await HandleCompletedHikes(userIdToFetch);
          }
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [userId, currentUser?.id, type]); // Add userId to dependencies

  if (loading) {
    return <p className="text-gray-500 dark:text-gray-400">Loading hikes...</p>;
  } else if (!loading && table && table.length === 0) {
    // Update message based on whether viewing own profile or friend's
    const isOwnProfile = !userId || userId === currentUser?.id;
    return (
      <p className="text-gray-500 dark:text-gray-400">
        {isOwnProfile 
          ? "You have not started any hike yet." 
          : "This user has not started any hike yet."}
      </p>
    );
  }

  const handleClick = (type, hike) => {
    // Only allow navigation if viewing own hikes
    const isOwnProfile = !userId || userId === currentUser?.id;
    
    if (isOwnProfile) {
      if (type === "current") {
        navigate(`/current/${hike.hikeid}`);
      } else if (type === "complete") {
        navigate(`/logentry/${hike.hikeid}`);
      }
    }
    // If viewing friend's hikes, don't navigate (or show a message)
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {table.map((hike) => (
        <RecentHikeItem 
          key={hike.hikeid} 
          data={hike} 
          onClick={() => handleClick(type, hike)} 
        />
      ))}
    </div>
  );
};

export default RecentHikes;