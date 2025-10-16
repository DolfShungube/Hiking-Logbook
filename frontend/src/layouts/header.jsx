import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/use-theme.jsx';
import PropTypes from 'prop-types';
import profileImg from '/src/assets/profile.jpg';
import defaultUserProfile from '../assets/profile.jpg';
import { ChevronsLeft, Search, Sun, Moon, Bell, X, User, Settings, LogOut, MapPin } from 'lucide-react';
import { UserAuth } from "../context/AuthContext.jsx";
import { friendDataCollection } from "../context/FriendsContext.jsx";
import { UserDataCollection } from "../context/UsersContext.jsx";
import { hikeDataCollection } from "../context/hikeDataContext.jsx";

// Notification Bell Component
const NotificationBell = ({ friendInvites = [], hikeInvites = [],friends=[], onFriendHandled, onHikeHandled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { currentUser } = UserAuth();
  const { acceptFriendInvite, rejectFriendInvite, acceptHikeInvite, rejectHikeInvite} = friendDataCollection();
  const { createNewHike,updateHike } = hikeDataCollection();

  const totalNotifications = friendInvites.length + hikeInvites.length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-ghost size-10 relative"
      >
        <Bell size={20} />
        
        {totalNotifications > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {totalNotifications > 9 ? '9+' : totalNotifications}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 max-h-[32rem] overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900 z-10">
            <h3 className="font-semibold text-slate-900 dark:text-slate-50">
              Notifications ({totalNotifications})
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {totalNotifications === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No new notifications</p>
              </div>
            ) : (
              <>
                {friendInvites.map((friend) => (
                  <div
                    key={friend.id}
                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={friend.avatar || defaultUserProfile}
                        alt={friend.name}
                        onError={(e) => (e.currentTarget.src = defaultUserProfile)}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900 dark:text-slate-50 font-medium">
                          Friend Request
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          <span className="font-medium">{friend.name}</span> sent you a friend request
                        </p>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => {

                              acceptFriendInvite(currentUser.id, friend.id);
                              onFriendHandled(friend.id, 'accept');
                            }}
                            className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => {
                              rejectFriendInvite(currentUser.id, friend.id);
                              onFriendHandled(friend.id, 'decline');
                            }}
                            className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {hikeInvites.map((hike) => (
                  <div
                    key={hike.hikeid}
                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900 dark:text-slate-50 font-medium">
                          Hike Invitation
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          You've been invited to <span className="font-medium">{hike.title+" " || 'a hike '}</span>
                           by {friends.find(obj => obj.id ===hike.userid)?.name|| "[unknown]"}
                        </p>
                        {hike.date && (
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                            {new Date(hike.date).toLocaleDateString()}
                          </p>
                        )}
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={async () => {
                                acceptHikeInvite(currentUser.id, hike.hikeid);

                                //check hiking group;

                                let group=hike.hikinggroup.members
                                group.push( currentUser.id)
                                hike.hikinggroup.members=group

                                const res= await createNewHike(
                                  currentUser.id,
                                  hike.startdate,
                                  hike.location,
                                  hike.weather,
                                  hike.elevation,
                                  hike.route,
                                  hike.status.trim(),
                                  hike.distance,
                                  hike.hikinggroup,
                                  hike.difficulty,
                                  hike.title
                                );

                              updateHike(res.hike.hikeid,currentUser.id,{hikeid:hike.hikeid})
                              onHikeHandled(hike.hikeid, 'accept');
                            }}
                            className="px-3 py-1.5 bg-blue-500  text-white text-sm rounded-md  hover:bg-blue-600 transition"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => {
                              rejectHikeInvite(currentUser.id, hike.hikeid);
                              onHikeHandled(hike.hikeid, 'decline');
                            }}
                            className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

NotificationBell.propTypes ={
  friendInvites: PropTypes.array,
  hikeInvites: PropTypes.array,
  onFriendHandled: PropTypes.func.isRequired,
  onHikeHandled: PropTypes.func.isRequired,
};

// Profile Dropdown Component
const ProfileDropdown = ({ currentUser, onProfileClick, onSettingsClick, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleProfileClick = () => {
    setIsOpen(false);
    if (onProfileClick) {
      onProfileClick();
    }
  };

  const handleSettingsClick = () => {
    setIsOpen(false);
    if (onSettingsClick) {
      onSettingsClick();
    }
  };

  const handleLogoutClick = async () => {
    setIsOpen(false);
    if (onLogout) {
      await onLogout();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onMouseEnter={() => setIsOpen(true)}
        onClick={handleProfileClick}
        className="size-10 overflow-hidden rounded-full ring-2 ring-transparent hover:ring-blue-500 transition-all"
      >
        <img
          src={currentUser?.picture || currentUser?.avatar || currentUser?.photo || defaultUserProfile} 
          alt="profile image"
          className="size-full object-cover"
        />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <img
                src={currentUser?.picture || currentUser?.avatar || currentUser?.photo || defaultUserProfile}
                alt="profile"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 dark:text-slate-50 truncate">
                  {currentUser?.userName ||  'User'}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                  {currentUser?.email || ''}
                </p>
              </div>
            </div>
          </div>

          <div className="py-2">
            <button
              onClick={handleProfileClick}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <User size={16} />
              <span>View Profile</span>
            </button>
            <button
              onClick={handleSettingsClick}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 py-2">
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

ProfileDropdown.propTypes = {
  currentUser: PropTypes.object,
  onProfileClick: PropTypes.func.isRequired,
  onSettingsClick: PropTypes.func,
  onLogout: PropTypes.func.isRequired,
};

const Header = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { currentUser, signOutUser } = UserAuth();
  const { getUser } = UserDataCollection();
  const { getUsersFriends } = friendDataCollection();
  const { getHike } = hikeDataCollection();

  const [invitesRecieved, setInvitesRecieved] = useState([]);
  const [hikeInvites, setHikeInvites] = useState([]);
  const [friends,setUsersFriends]=useState([]);

  const handleFriends = async (userId) => {
    try {
      let friendIDCollection = await getUsersFriends(userId);
      let friendsData = friendIDCollection?.friend_list?.friends || [];
      let MyinvitesReceived = (friendIDCollection?.friend_list?.invitesreceived || []).map(item => item.userid);
      let myHikeInvites = (friendIDCollection?.friend_list?.hikeInvites || []);


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
        myHikeInvites.map(async (item) => {
          let hikeItemTmp = await getHike(item.hikeid, item.user);
          if (!hikeItemTmp) return null;
          let data = hikeItemTmp[0];
          return data;
        })
      );


      setUsersFriends(friendsList.filter(Boolean));
      setInvitesRecieved(friendsInviteList.filter(Boolean));
      setHikeInvites(hikeInviteList.filter(Boolean));

    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      handleFriends(currentUser.id);
    }
  }, [currentUser?.id]);

  const handleFriendAction = (id, action) => {
    if (action === 'accept') {
      console.log('Accepted friend:', id);
    } else {
      console.log('Declined friend:', id);
    }
    setInvitesRecieved(prev => prev.filter(u => u.id !== id));
  };

  const handleHikeAction = (id, action) => {
    if (action === 'accept') {
      console.log('Accepted hike:', id);
    } else {
      console.log('Declined hike:', id);
    }
    setHikeInvites(prev => prev.filter(h => h.hikeid !== id));
  };

  const handleProfileNavigation = () => {
    navigate('/profile');
  };

  const handleSettingsNavigation = () => {
    navigate('/dashboard/Settings');
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
      <div className="flex items-center gap-x-3">
        <button className="btn-ghost size-10" onClick={() => setCollapsed(!collapsed)}>
          <ChevronsLeft className={collapsed && "rotate-180"} />
        </button>
        <div className="input">
          <Search
            size={20}
            className="text-slate-300"
          />
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search..."
            className="w-full bg-transparent text-slate-900 outline-0 placeholder:text-slate-300 dark:text-slate-50"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-x-3">
        <button 
          className="btn-ghost size-10" 
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun size={20} className="dark:hidden" />
          <Moon size={20} className="hidden dark:block" />
        </button>
        
        <NotificationBell
          friendInvites={invitesRecieved}
          hikeInvites={hikeInvites}
          friends={friends}
          onFriendHandled={handleFriendAction}
          onHikeHandled={handleHikeAction}
        />
        
        <ProfileDropdown 
          currentUser={currentUser}
          onProfileClick={handleProfileNavigation}
          onSettingsClick={handleSettingsNavigation}
          onLogout={handleLogout}
        />
      </div>
    </header>
  );
};

export default Header;

Header.propTypes = {
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
};