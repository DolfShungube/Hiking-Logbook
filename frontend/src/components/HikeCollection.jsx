import React, { useEffect, useState } from 'react';
import { hikeDataCollection } from '../context/hikeDataContext';
import { UserAuth } from '../context/AuthContext';
import HikeItem from './hikeItem';
import { useNavigate } from "react-router-dom";

const HikeCollection = ({ type }) => {
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
    if (currentUser?.id) {
      setLoading(true);
      try {
        if (type === "current") {
          await HandleCurrentHike(currentUser.id);
        } else {
          await HandleCompletedHikes(currentUser.id);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  fetchData();
}, [currentUser, type]);

  if (loading){
    return <p className="text-gray-500 dark:text-gray-400">Loading hikes...</p>;
  } else if (!loading && table && table.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400">You have not started any hike yet.</p>;
  }

  const handleClick = (type, hike) => {
    if (type === "current") {
      navigate(`/current/${hike.hikeid}`); // Navigate to Current Hike page
    } else if (type === "complete") {
      navigate(`/logentry/${hike.hikeid}`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {table.map((hike) => (
        <HikeItem key={hike.hikeid} data={hike} onClick={() => handleClick(type, hike)} />
      ))}
    </div>
  );
};

export default HikeCollection;
