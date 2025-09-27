import React, { useEffect, useRef, useState } from "react";
import { MapPinned, ChevronRight } from "lucide-react";
import { useTheme } from "../hooks/use-theme.jsx";
import defaultUserProfile from "../assets/profile.jpg";

import RouteTracker from "../components/map.jsx"
import { UserAuth } from "../context/AuthContext.jsx";
import { friendDataCollection } from "../context/FriendsContext.jsx";
import { UserDataCollection } from "../context/UsersContext.jsx";
import { UserPlus} from 'lucide-react';

import Notification from "../components/Notification.jsx";
import { hikeDataCollection } from "../context/hikeDataContext.jsx";



let mydata=null

const DashboardPage = () => {
  const { theme } = useTheme();
  const [showAllFriends, setShowAllFriends] = useState(false);
  const [friends,setUsersFriends]=useState([]);
  const[invitesRecieved,setInvitesRecieved]=useState([])
  const[hikeInvites,sethikeInvites]=useState([])
  const[invitesSent,setInvitesSent]=useState([])

  const [showAllRecs, setShowAllRecs] = useState(false);
  const {session,currentUser}= UserAuth()
  const {getUser,getUserByName}= UserDataCollection()
  const{getUsersFriends,newFriendInvite}= friendDataCollection()
  const{getHike}= hikeDataCollection()
  

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchTimeout = useRef(null);





  const handleInvite = async (user_id,friend_id) => {
      let res=await newFriendInvite(friend_id,user_id);
   
  };


const handleSearch= async (query) => {
  try {

    if (query.trim()===""){
      setSearchResults([])
      return
    }

    let friendsData = await getUserByName(query)|| [];

    let friendsList = await Promise.all(
      friendsData.map(async (friendObj) => {
        let friendid= friendObj.id
        const alreadyFriend = friends.some(f => f.id === friendid);
        if (alreadyFriend || friendid==currentUser.id ){
          return null
        };
        let user = await getUser(friendid);

     

        if (!user) return null;

        return {
          id: friendid,
          name: user.full_name ?? user.firstname ?? "Unknown User",
          avatar: user.picture || defaultUserProfile,
        };
      })
    );  


        const uniqueResults = friendsList
      .filter(Boolean)
      .reduce((acc, user) => {
        if (!acc.some(u => u.id === user.id)) {
          acc.push(user);
        }
        return acc;
      }, []);

      setSearchResults(uniqueResults)

  } catch (err){
    console.error("Error fetching friends:", err);
  }
};


const handleSearchTimed = (e) =>{
  const query = e.target.value;
  setSearchQuery(query);

  if (searchTimeout.current) clearTimeout(searchTimeout.current);
  searchTimeout.current = setTimeout(() => {
    handleSearch(query);
  }, 300);
};


const handleFriends = async (userId) => {
  try {

    let friendIDCollection = await getUsersFriends(userId);
    let friendsData = friendIDCollection?.friend_list?.friends || [];
    let MyinvitesReceived = (friendIDCollection?.friend_list?.invitesreceived || []).map(item => item.userid);
    let MyinvitesSent=(friendIDCollection?.friend_list?.invitessent||[]).map(item => item.userid);
    let myHikeInvites=(friendIDCollection?.friend_list?.hikeInvites||[]);
    setInvitesSent(MyinvitesSent)
   


    let friendsList = await Promise.all(
      friendsData.map(async (friendid) => {
        let userData = await getUser(friendid);
        let user = userData;
     

        if (!user) return null;

        return {
          id: friendid,
          name: user.full_name || user.firstname,
          avatar: user.picture || defaultUserProfile,
        };
      })
    );


    let friendsInviteList = await Promise.all(
      MyinvitesReceived.map(async (friendid) => {
        let user = await getUser(friendid);
        // let user = userData;
     

        if (!user) return null;

        return {
          id: friendid,
          name: user.full_name || user.firstname,
          avatar: user.picture || defaultUserProfile,
        };
      })
    );
    
    let hikeInviteList = await Promise.all(
      myHikeInvites.map(async (item)=>{

        let hikeItemTmp= await getHike(item.hikeid,item.user);
        
        if(!hikeItemTmp){return}
        let data=hikeItemTmp[0]
        return data
          
        

      })

    )



    setUsersFriends(friendsList.filter(Boolean));
    setInvitesRecieved(friendsInviteList.filter(Boolean))
    sethikeInvites(hikeInviteList.filter(Boolean))
   
    

  } catch (err) {
    console.error("Error fetching friends:", err);
  }
};


// const handleSearch=(e)=>{
//   setSearchQuery(e.target.value);
// }

useEffect(() => {
  if (currentUser?.id) {
    handleFriends(currentUser.id);
  }

}, [currentUser?.id]);



  return (
    <div className="p-6 flex flex-col gap-6 min-h-screen">
      {currentUser?.userName ? (<h1 className="title">Hi, {currentUser.userName}</h1>) : (<p className="title">Loading...</p>)}
      <h2 className="text-base font-medium text-slate-500 dark:text-slate-400">
        Welcome back! Let's go on a Hike
      </h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 flex-grow">
        {/* MOST VISITED PLACE */}
        <div className="card lg:col-span-8">
          <div className="card-header flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 dark:bg-blue-600/20 dark:text-blue-600">
                <MapPinned size={22} />
              </div>
              <p className="card-title">Most Visited Place</p>
            </div>
            <button className="rounded-md bg-slate-100 px-3 py-1 text-sm dark:bg-slate-900">
              Weekly
            </button>
          </div>

          <div className="card-body bg-slate-100 dark:bg-slate-950 w-180 h-100 overflow-hidden">
              <RouteTracker preview routeGeoJSON={mydata} className="w-full h-full" />
          </div>
        </div>

            {/* FRIENDLIST */}
<div className="card lg:col-span-4">
      <div className="card-header flex items-center justify-between">
        <p className="card-title">Friendlist</p>

        {/* Toggle Search Mode */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="relative group p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <UserPlus className="w-5 h-5 text-slate-700 dark:text-slate-200" />
          <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 
                          opacity-0 group-hover:opacity-100
                          bg-slate-900 text-white text-xs rounded px-2 py-1
                          whitespace-nowrap transition">
            Find friends
          </span>
        </button>

        {!showSearch &&(
          <button
            className="text-sm text-blue-500 dark:text-blue-600"
            onClick={() => setShowAllFriends(!showAllFriends)}
          >
            {showAllFriends ? "Show Less" : "View All"}{" "}
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      <div className="card-body p-0">
        {showSearch ? (
          <>
            {/* Search Input */}
            <div className="p-3">
              <input
                type="text"
                placeholder="Search for friends..."
                value={searchQuery}
                onChange={handleSearchTimed}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2 text-sm 
                           bg-white dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Search Results */}
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              { searchResults.length === 0 ? (
                <li className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  No results
                </li>
              ) : (
                searchResults.map((u) => (

                  
                  <li
                    key={u.id}
                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar || defaultUserProfile}
                        alt={u.name}
                        onError={(e) =>
                          (e.currentTarget.src = defaultUserProfile)
                        }
                        className="size-10 rounded-full object-cover"
                      />
                      <span className="font-medium text-slate-900 dark:text-slate-50">
                        {u.name}
                      </span>
                    </div>
                {invitesSent.includes(u.id)?(
                  <span className="text-sm text-gray-500">Invite Sent</span>
                ) : (
                  <button
                    onClick={() =>{
                     setInvitesSent(prev => [...prev, u.id])
                      handleInvite(currentUser.id, u.id)
                      .catch(err =>{
                          console.error("Failed to send invite:", err);
                          setSentInvites(prev => prev.filter(id => id !== u.id));
                          })
                    }}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Invite
                  </button>)}
                  </li>
                ))
              )}
            </ul>
          </>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {friends.length === 0 ? (
              <li className="px-4 py-3 text-slate-500 dark:text-slate-400">
                No friends yet
              </li>
            ) : (
              (showAllFriends ? friends : friends.slice(0, 3)).map((f) => (
                <li
                  key={f.id}
                  onClick={() => console.log("clicked", f)}
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={f.avatar || defaultUserProfile}
                      alt={f.name}
                      onError={(e) =>
                        (e.currentTarget.src = defaultUserProfile)
                      }
                      className="size-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900 dark:text-slate-50">
                        {f.name}
                      </span>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>

    <div className="card lg:col-span-8">

          <div className="card-header flex items-center justify-between">
            <p className="card-title">Notifications</p>
            <button
              className="text-blue-500 dark:text-blue-600"
              onClick={() => setShowAllRecs(!showAllRecs)}
            >
              {showAllRecs ? "Show Less" : "View All"} <ChevronRight size={16} />
            </button>
          </div>



      <Notification
  friendInvites={invitesRecieved} 
  HikeInvites={hikeInvites} 
  friends={friends}
  onFriendHandled={(id) => setInvitesRecieved(prev => prev.filter(u => u.id !== id))}
  onHikeHandled={(id) => sethikeInvites(prev => prev.filter(h => h.hikeid !== id))}
  
     
      />
    </div>
  

      
      </div>
    </div>
  );
};

export default DashboardPage;
