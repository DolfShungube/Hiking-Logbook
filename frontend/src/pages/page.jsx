import React, { useState } from "react";
import { MapPinned, ChevronRight } from "lucide-react";
import { useTheme } from "../hooks/use-theme.jsx";
import mountain from "../assets/map-world.png";
import { UserAuth } from "../context/AuthContext";

const {session,signOutUser,getCurrentUser}= UserAuth()



const getUserData= async()=>{

  try {
    const res= await getCurrentUser()
    //const name=res.user_metadata.name
    return res
    
  } catch (error) {
    console.log(error)
  }



}

let User= getUserData()

let name= User.user_metadata.name

if(name==undefined){
  name=User.user_metadata.name.firstname
}

const friends = [
  { id: 1, name: "Albert Flores", status: "Online", time: "10:15", avatar: "https://i.pravatar.cc/100?img=11" },
  { id: 2, name: "Marvin Kay", status: "Online", time: "09:50", avatar: "https://i.pravatar.cc/100?img=12" },
  { id: 3, name: "Guy Hawkin", status: "Online", time: "08:30", avatar: "https://i.pravatar.cc/100?img=13" },
  { id: 4, name: "Stephanie", status: "1 hour ago", time: "07:20", avatar: "https://i.pravatar.cc/100?img=14" },
  { id: 5, name: "Liam Parker", status: "Online", time: "06:45", avatar: "https://i.pravatar.cc/100?img=15" },
  { id: 6, name: "Sofia Carter", status: "Online", time: "05:30", avatar: "https://i.pravatar.cc/100?img=16" },
];

const recommendations = [
  { id: 1, title: "Hiking on Mount Denali", location: "Alaska", dates: "2 Dec – 3 Dec", cta: "Join" },
  { id: 2, title: "Camping on Cho Oyu", location: "Nepal", dates: "1 Jan – 5 Jan", cta: "Joined" },
  { id: 3, title: "Explore Mount Elbrus", location: "Russia", dates: "10 Jan – 20 Jan", cta: "Join" },
  { id: 4, title: "Climbing Mt. Fuji", location: "Japan", dates: "15 Mar – 18 Mar", cta: "Join" },
  { id: 5, title: "Hiking in the Andes", location: "Peru", dates: "1 Apr – 6 Apr", cta: "Join" },
];

const DashboardPage = () => {
  const { theme } = useTheme();
  const [showAllFriends, setShowAllFriends] = useState(false);
  const [showAllRecs, setShowAllRecs] = useState(false);

  return (
    <div className="p-6 flex flex-col gap-6 min-h-screen">
      <h1 className="title">Hi, {name} 👋</h1>
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

          <div className="card-body bg-slate-100 dark:bg-slate-950">
            <img
              src={mountain}
              alt="Most Visited Place"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        </div>

            {/* FRIENDLIST */}
        <div className="card lg:col-span-4">
          <div className="card-header flex items-center justify-between">
            <p className="card-title">Friendlist</p>
            <button
              className="text-sm text-blue-500 dark:text-blue-600"
              onClick={() => setShowAllFriends(!showAllFriends)}
            >
              {showAllFriends ? "Show Less" : "View All"} <ChevronRight size={16} />
            </button>
          </div>

          <div className="card-body p-0">
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {(showAllFriends ? friends : friends.slice(0, 3)).map((f) => (
                <li key={f.id} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={f.avatar} alt={f.name} className="size-10 rounded-full object-cover" />
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900 dark:text-slate-50">{f.name}</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{f.status}</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{f.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RECOMMENDATIONS FOR YOU */}
        <div className="card lg:col-span-12">
          <div className="card-header flex items-center justify-between">
            <p className="card-title">Recommendation For You 🌈</p>
            <button
              className="text-blue-500 dark:text-blue-600"
              onClick={() => setShowAllRecs(!showAllRecs)}
            >
              {showAllRecs ? "Show Less" : "View All"} <ChevronRight size={16} />
            </button>
          </div>

          <div className="card-body flex flex-col gap-4">
            {(showAllRecs ? recommendations : recommendations.slice(0, 3)).map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-lg bg-slate-50 p-4 dark:bg-slate-900"
              >
                <div className="flex flex-col">
                  <p className="font-semibold text-slate-900 dark:text-slate-50">{r.title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {r.location} • {r.dates}
                  </p>
                </div>
                <button
                  className={`px-4 py-1 rounded-full text-white ${
                    r.cta === "Joined" ? "bg-slate-400" : "bg-blue-500"
                  }`}
                >
                  {r.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
