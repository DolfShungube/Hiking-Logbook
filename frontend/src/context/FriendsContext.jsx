import { createContext, useContext, useState } from "react";

const FriendDataContext= createContext(null);


 export const FriendDataContextProvider=({children})=>{

        const getUsersFriends= async(user_id)=>{

        try {

            const res= await fetch(
                `https://hiking-logbook-api.onrender.com/get-friends?userid=${encodeURIComponent(user_id)}`,{
                method:"GET",
            })

            const data = await res.json();

            if(!res.ok){
                console.error("Error fetching users friends:", data.error);
                throw new Error(data.error || "Failed to fetch users friends");
            }

            return data;
            
        } catch (err) {
        console.error("fetching error:", err);
            throw err;            
        }

    }

const newFriendInvite = async (friendid,userid) =>{
  try {
    const res = await fetch('https://hiking-logbook-api.onrender.com/invite-friend',{
    
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        friendid:friendid,
        userid:userid
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error("error:", err);
    throw err;
  }
};



const acceptFriendInvite = async (friendid,userid) =>{
  try {
    const res = await fetch('https://hiking-logbook-api.onrender.com/accept-invite',{
    
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        friendid:friendid,
        userid:userid
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error("error:", err);
    throw err;
  }
};



const rejectFriendInvite = async (friendid,userid) =>{
  try {
    const res = await fetch('https://hiking-logbook-api.onrender.com/reject-invite',{
    
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        friendid:friendid,
        userid:userid
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error("error:", err);
    throw err;
  }
};


const newHikeInvite = async (friendid,userid,hikeid) =>{
  try {
    const res = await fetch('https://hiking-logbook-api.onrender.com/invite-friend-hike',{
    
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        friendid:friendid,
        userid:userid,
        hikeid:hikeid
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error("error:", err);
    throw err;
  }
};



const acceptHikeInvite = async (friendid,hikeid) =>{
  try {
    const res = await fetch('https://hiking-logbook-api.onrender.com/accept-hike-invite',{
    
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        friendid:friendid,
        hikeid:hikeid
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error("error:", err);
    throw err;
  }
};


const rejectHikeInvite = async (friendid,hikeid) =>{ // had user id
  try {
    const res = await fetch('https://hiking-logbook-api.onrender.com/reject-hike-invite',{
    
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        friendid:friendid,
        hikeid:hikeid
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error("error:", err);
    throw err;
  }
};





    return (
        <FriendDataContext.Provider value={{getUsersFriends,newFriendInvite,acceptFriendInvite,rejectFriendInvite,newHikeInvite,acceptHikeInvite,rejectHikeInvite}}>
            {children}
        </FriendDataContext.Provider>
    )

}

export const friendDataCollection=()=>{

        return useContext(FriendDataContext);
}

