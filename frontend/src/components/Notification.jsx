
import { UserAuth } from '../context/AuthContext';
import HikeItem from './hikeItem';
import { friendDataCollection } from '../context/FriendsContext';
import React from 'react';
import { hikeDataCollection } from '../context/hikeDataContext';
import defaultUserProfile from "../assets/profile.jpg";


export default function Notification({ friendInvites, HikeInvites, friends, onFriendHandled, onHikeHandled}) {
  const { currentUser } = UserAuth();
  const { acceptFriendInvite, rejectFriendInvite, acceptHikeInvite, rejectHikeInvite} = friendDataCollection();
  const { createNewHike,updateHike } = hikeDataCollection();


 

  return (

    <ul className="space-y-5">
      {/* Friend Invites */}

    {friendInvites.length === 0 && HikeInvites.length === 0 ? (
      <li className="text-center text-slate-500 dark:text-slate-400">
        nothing new
      </li>
    ) : (
      <>
    
      {friendInvites.map((u) =>(
        <li
          key={u.id}
          className="w-full flex items-center px-4 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
        >
          <div className="flex items-center gap-3">
            <img
              src={u.avatar || defaultUserProfile}
              alt={u.name}
              onError={(e) => (e.currentTarget.src = defaultUserProfile)}
              className="size-10 rounded-full object-cover shrink-0"
            />
            <div className="min-w-0">
              <h3 className="font-medium text-slate-900 dark:text-slate-50 truncate">
                {u.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                sent you a friend invite
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                acceptFriendInvite(currentUser.id, u.id);
                onFriendHandled(u.id);
              }}
              className="rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600"
            >
              Accept
            </button>
            <button
              onClick={() => {
                rejectFriendInvite(currentUser.id, u.id);
                onFriendHandled(u.id);
              }}
              className="rounded-lg bg-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
            >
              Reject
            </button>
          </div>
        </li>
      ))}

      {HikeInvites.map((hike) => (
        <li
          key={hike.hikeid}
          className="rounded-xl bg-white dark:bg-slate-900 shadow-md border border-slate-200 dark:border-slate-700 p-4 transition hover:shadow-lg"
        >
           <p className='font-medium'>Hike invite from {friends.find(obj => obj.id ===hike.userid)?.name|| "[unknown]"} </p>
          <div className="flex items-center gap-3">
    
            <div className="flex-1 flex-wrap min-w-0">
              <HikeItem data={hike} />
            </div>

          <div className="mt-4 flex justify-end gap-2">
           
            <button
              onClick={async () => {
                acceptHikeInvite(currentUser.id, hike.hikeid);
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

                console.log(res,"this")
                
                updateHike(res.hike.hikeid,currentUser.id,{hikeid:hike.hikeid})
                onHikeHandled(hike.hikeid);
              }}
              className="rounded-lg bg-green-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-600"
            >
              Accept
            </button>
            <button
              onClick={() => {
                rejectHikeInvite(currentUser.id, hike.hikeid);
                onHikeHandled(hike.hikeid);
              }}
              className="rounded-lg bg-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
            >
              Reject
            </button>
          </div>            
          </div>
         

        </li>
      ))}
      </>
    )}
    </ul>
  )
  ;
}
