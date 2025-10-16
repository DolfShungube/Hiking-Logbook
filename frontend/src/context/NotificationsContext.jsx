import { createContext, useContext, useEffect, useState } from "react";
import { UserAuth } from "./AuthContext.jsx";
import { friendDataCollection } from "./FriendsContext.jsx";
import { UserDataCollection } from "./UsersContext.jsx";
import { hikeDataCollection } from "./hikeDataContext.jsx";
import defaultUserProfile from '../assets/profile.jpg';
import toast from "react-hot-toast";


const NotificationsContext = createContext();


export const NotificationsProvider = ({ children }) => {
  const { currentUser } = UserAuth();
  const { getUser } = UserDataCollection();
  const { getUsersFriends } = friendDataCollection();
  const { getHike } = hikeDataCollection();

  const [invitesRecieved, setInvitesRecieved] = useState([]);
  const [hikeInvites, setHikeInvites] = useState([]);
  const [friends, setFriends] = useState([]);
  const [message, setMessage] = useState(null);
  


  const handleFriends = async (userId) => {
    try {
      let friendIDCollection = await getUsersFriends(userId);
      let friendsData = friendIDCollection?.friend_list?.friends || [];
      let MyinvitesReceived = (friendIDCollection?.friend_list?.invitesreceived || []).map(
        (item) => item.userid
      );
      let myHikeInvites = friendIDCollection?.friend_list?.hikeInvites || [];

      let friendsList = await Promise.all(
        friendsData.map(async (friendid) => {
          let user = await getUser(friendid);
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
          return hikeItemTmp[0];
        })
      );

      setFriends(friendsList.filter(Boolean));
      setInvitesRecieved(friendsInviteList.filter(Boolean));
      setHikeInvites(hikeInviteList.filter(Boolean));
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };


const handleFriendAction = async (id, action) => {
  setMessage({ type: "success", text: "Friend request accepted!" });
  try {
    if (action === 'accept') {
      const user = await getUser(id);

      if (user) {
        const data ={
          id,
          name: user.full_name || user.firstname,
          avatar: user.picture || defaultUserProfile,
        };

        setFriends(prev => [...prev, data]);
      }


      setInvitesRecieved(prev => prev.filter(u => u.id !== id));


    } 
    else if (action === 'decline') {
       setMessage({ type: "error", text: "Friend request declined" });
      setInvitesRecieved(prev => prev.filter(u => u.id !== id));
      

    }
    setTimeout(() => setMessage(null), 3000);
  } catch (err) {
    console.error("Error handling friend action:", err);
  }
};


  const handleHikeAction =  (id, action) =>{
    if (action === 'accept') {
        setMessage({ type: "success", text: "Hike invite accepted!" });
    } else {
      setMessage({ type: "error", text:"Hike invitation declined"  });

    }
    setTimeout(() => setMessage(null), 3000);
    setHikeInvites((prev) => prev.filter((h) => h.hikeid !== id));
  };

  useEffect(() => {
    if (currentUser?.id) {
      handleFriends(currentUser.id);
    }
  }, [currentUser?.id]);

  return(
    <NotificationsContext.Provider
      value={{
        invitesRecieved,
        hikeInvites,
        friends,
        handleFriends,
        handleFriendAction,
        handleHikeAction,
        message,
        setMessage
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const NotificationDataCollection = () => useContext(NotificationsContext);