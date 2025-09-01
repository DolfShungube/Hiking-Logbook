import React, { useEffect, useState } from 'react';
import { MapPinned, NotebookPen, Flag, Users, Clock, Map, Activity, X } from 'lucide-react';
import RouteTracker from '../components/map.jsx';
import { useParams } from 'react-router-dom';
import { hikeDataCollection } from '../context/hikeDataContext.jsx';
import route from 'color-convert/route.js';
import { RouteDataCollection } from '../context/MapRoutesContext.jsx';

const Current = () => {
  const [showNotes, setShowNotes] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [notes, setNotes] = useState("");
  const [goals, setGoals] = useState(["Reach summit", "Take photos at viewpoint"]);
  const [mapData,setMapData]=useState(null)

  const { hikeid } = useParams();
  const {getHike} = hikeDataCollection()
  const {getRouteJson}= RouteDataCollection()
 
 

  const friends = [
    { id: 1, name: "Albert Flores", status: "Online", avatar: "https://i.pravatar.cc/100?img=11" },
    { id: 2, name: "Sofia Carter", status: "Online", avatar: "https://i.pravatar.cc/100?img=16" },
  ];

  const addGoal = (goal) => {
    if (goal.trim() !== "") setGoals([...goals, goal.trim()]);
  };

  const removeGoal = (idx) => {
    setGoals(goals.filter((_, i) => i !== idx));
  };


  const handleMap= async(hike_id)=>{
  let res = await getHike(hike_id);
  const routeid=res[0]?.route || null

  if(routeid){

    let data= await getRouteJson(routeid)
    if(data[0]){
      console.log(data[0])
    setMapData(data[0]?.path || null)
  }
    

  }


  }


  useEffect(()=>{

    if(!mapData){
      handleMap(hikeid);

    }


  },[hikeid])




  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Current Hike */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Your Current Hike</h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Map */}
          <div className="lg:col-span-8 bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden shadow-lg">
            {mapData?(
            <RouteTracker routeGeoJSON={mapData} className="w-full h-[420px]" />):(<p className="text-center text-gray-500">Loading map...</p>)}
          </div>

          {/* Trail Info + Action Buttons */}
          <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg flex flex-col justify-between transition-all hover:shadow-xl">
            
            {/* Trail Info */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 border-b pb-2 border-gray-200 dark:border-gray-700">
                Trail Info
              </h3>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-3">
                  <Map size={20} className="text-blue-500 dark:text-blue-400" />
                  <span className="font-medium">Distance:</span>
                  <span className="ml-auto">12 km</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock size={20} className="text-green-500 dark:text-green-400" />
                  <span className="font-medium">Time:</span>
                  <span className="ml-auto">3 hrs</span>
                </li>
                <li className="flex items-center gap-3">
                  <Activity size={20} className="text-red-500 dark:text-red-400" />
                  <span className="font-medium">Difficulty:</span>
                  <span className="ml-auto">Moderate</span>
                </li>
                <li className="flex items-center gap-3">
                  <MapPinned size={20} className="text-purple-500 dark:text-purple-400" />
                  <span className="font-medium">Duration:</span>
                  <span className="ml-auto">2 hrs left</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto grid grid-cols-3 gap-4">
              <button
                onClick={() => setShowNotes(true)}
                className="flex flex-col items-center p-4 rounded-xl bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 transition transform hover:-translate-y-1"
              >
                <NotebookPen size={24} className="text-blue-600 dark:text-blue-400 mb-1" />
                <span className="text-sm font-medium">Notes</span>
              </button>

              <button
                onClick={() => setShowGoals(true)}
                className="flex flex-col items-center p-4 rounded-xl bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 transition transform hover:-translate-y-1"
              >
                <Flag size={24} className="text-green-600 dark:text-green-400 mb-1" />
                <span className="text-sm font-medium">Goals</span>
              </button>

              <button
                onClick={() => setShowFriends(true)}
                className="flex flex-col items-center p-4 rounded-xl bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800 transition transform hover:-translate-y-1"
              >
                <Users size={24} className="text-purple-600 dark:text-purple-400 mb-1" />
                <span className="text-sm font-medium">Friends</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Modal */}
      {showNotes && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Add Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100"
              rows="5"
              placeholder="Write your notes here..."
            />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowNotes(false)} className="px-4 py-2 bg-gray-300 rounded dark:bg-gray-700">Cancel</button>
              <button onClick={() => setShowNotes(false)} className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Goals Modal */}
      {showGoals && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Your Goals</h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-4">
              {goals.map((goal, idx) => (
                <li key={idx} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <span>{goal}</span>
                  <button onClick={() => removeGoal(idx)} className="text-red-500 hover:text-red-700">
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
            <textarea
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100"
              rows="2"
              placeholder="Add a new goal and press Enter..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim() !== "") {
                  addGoal(e.target.value);
                  e.target.value = "";
                  e.preventDefault();
                }
              }}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowGoals(false)} className="px-4 py-2 bg-blue-500 text-white rounded">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Friends Modal */}
      {showFriends && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Friends on Hike</h3>
            <ul>
              {friends.map((f) => (
                <li key={f.id} className="flex items-center gap-3 mb-3">
                  <img src={f.avatar} alt={f.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="text-gray-900 dark:text-gray-100">{f.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{f.status}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowFriends(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Current;
