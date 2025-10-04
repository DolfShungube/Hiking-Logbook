import React, { useEffect, useRef, useState } from "react";
import { MapPinned, ChevronRight, X, TrendingUp, Users, Calendar } from "lucide-react";
import { useTheme } from "../hooks/use-theme.jsx";
import defaultUserProfile from "../assets/profile.jpg";
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
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

  const handleViewFriendProfile = (friendId) => {
    // Navigate to friend's profile page with their ID as a URL parameter
    navigate(`/profile/friend/${friendId}`);
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

  useEffect(() => {
    if (currentUser?.id) {
      handleFriends(currentUser.id);
    }
  }, [currentUser?.id]);

  // Calculate stats
  const totalNotifications = invitesRecieved.length + hikeInvites.length;

  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-6 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        {currentUser?.userName ? (
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Hi, {currentUser.userName}! 👋
          </h1>
        ) : (
          <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg"></div>
        )}
        <p className="text-base md:text-lg text-slate-600 dark:text-slate-400">
          Welcome back! Ready for your next adventure?
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Friends</p>
              <p className="text-3xl font-bold mt-1">{friends.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Notifications</p>
              <p className="text-3xl font-bold mt-1">{totalNotifications}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Calendar size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">This Week</p>
              <p className="text-3xl font-bold mt-1">5</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 flex-grow">
        {/* MOST VISITED PLACE */}
        <div className="card lg:col-span-8 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
          <div className="card-header flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-fit rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 text-white shadow-md">
                <MapPinned size={22} />
              </div>
              <div>
                <p className="card-title">Most Visited Place</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Your hiking hotspots</p>
              </div>
            </div>
            <button className="rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-4 py-2 text-sm font-medium transition-colors">
              Weekly
            </button>
          </div>

          <div className="card-body bg-slate-100 dark:bg-slate-950 h-96 overflow-hidden relative">
            <RouteTracker preview routeGeoJSON={mydata} className="w-full h-full" />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white/5 to-transparent"></div>
          </div>
        </div>

        {/* FRIENDLIST */}
        <div className="card lg:col-span-4 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
          <div className="card-header flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="card-title">Friends</p>
              <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                {friends.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setShowSearch(!showSearch);
                  if (showSearch) {
                    setSearchQuery("");
                    setSearchResults([]);
                  }
                }}
                className="relative group p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {showSearch ? (
                  <X className="w-4 h-4 text-slate-700 dark:text-slate-200" />
                ) : (
                  <UserPlus className="w-4 h-4 text-slate-700 dark:text-slate-200" />
                )}
                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 
                                opacity-0 group-hover:opacity-100
                                bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg px-2 py-1
                                whitespace-nowrap transition-opacity z-10 shadow-lg">
                  {showSearch ? "Close search" : "Find friends"}
                </span>
              </button>

              {!showSearch && friends.length > 3 && (
                <button
                  className="text-xs text-blue-500 dark:text-blue-400 flex items-center gap-1 hover:gap-2 font-medium transition-all"
                  onClick={() => setShowAllFriends(!showAllFriends)}
                >
                  {showAllFriends ? "Less" : "All"}
                  <ChevronRight size={14} className={`transition-transform ${showAllFriends ? "rotate-90" : ""}`} />
                </button>
              )}
            </div>
          </div>

          <div className="card-body p-0">
            {showSearch ? (
              <>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for friends..."
                      value={searchQuery}
                      onChange={handleSearchTimed}
                      autoFocus
                      className="w-full rounded-lg border-2 border-slate-200 dark:border-slate-700 pl-4 pr-4 py-2.5 text-sm 
                                 bg-white dark:bg-slate-900 dark:text-slate-100 
                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                 transition-all placeholder:text-slate-400"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {searchQuery.trim() === "" ? (
                    <div className="px-4 py-12 text-center text-slate-500 dark:text-slate-400">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <UserPlus className="w-8 h-8 opacity-50" />
                      </div>
                      <p className="font-medium">Find Your Hiking Buddies</p>
                      <p className="text-sm mt-1">Start typing to search</p>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="px-4 py-12 text-center text-slate-500 dark:text-slate-400">
                      <p className="font-medium">No users found</p>
                      <p className="text-sm mt-1">Try a different search</p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                      {searchResults.map((u) => (
                        <li
                          key={u.id}
                          className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition group"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="relative">
                              <img
                                src={u.avatar || defaultUserProfile}
                                alt={u.name}
                                onError={(e) => (e.currentTarget.src = defaultUserProfile)}
                                className="size-10 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-blue-500 transition"
                              />
                              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                            </div>
                            <span className="font-medium text-slate-900 dark:text-slate-50 truncate">
                              {u.name}
                            </span>
                          </div>
                          {invitesSent.includes(u.id) ? (
                            <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full">
                              Invited ✓
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                setInvitesSent(prev => [...prev, u.id])
                                handleInvite(currentUser.id, u.id)
                                  .catch(err => {
                                    console.error("Failed to send invite:", err);
                                    setInvitesSent(prev => prev.filter(id => id !== u.id));
                                  })
                              }}
                              className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
                            >
                              Invite
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {friends.length === 0 ? (
                  <div className="px-4 py-12 text-center text-slate-500 dark:text-slate-400">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                      <UserPlus className="w-8 h-8 text-blue-500" />
                    </div>
                    <p className="font-medium mb-1">No friends yet</p>
                    <p className="text-sm mb-4">Start building your hiking crew</p>
                    <button
                      onClick={() => setShowSearch(true)}
                      className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                    >
                      <UserPlus size={16} />
                      Find Friends
                    </button>
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                    {(showAllFriends ? friends : friends.slice(0, 3)).map((f) => (
                      <li
                        key={f.id}
                        onClick={() => handleViewFriendProfile(f.id)}
                        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition group"
                      >
                        <img
                          src={f.avatar || defaultUserProfile}
                          alt={f.name}
                          onError={(e) => (e.currentTarget.src = defaultUserProfile)}
                          className="size-12 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-blue-500 transition"
                        />
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="font-medium text-slate-900 dark:text-slate-50 truncate">
                            {f.name}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Click to view profile
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div className="card lg:col-span-12 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
          <div className="card-header flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              {totalNotifications > 0 && (
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              )}
              <p className="card-title">Activity & Notifications</p>
              {totalNotifications > 0 && (
                <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-medium">
                  {totalNotifications} new
                </span>
              )}
            </div>
            <button
              className="text-xs text-blue-500 dark:text-blue-400 flex items-center gap-1 hover:gap-2 font-medium transition-all"
              onClick={() => setShowAllRecs(!showAllRecs)}
            >
              {showAllRecs ? "Show Less" : "View All"}
              <ChevronRight size={14} className={`transition-transform ${showAllRecs ? "rotate-90" : ""}`} />
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