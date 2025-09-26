
import { Users, Calendar, Clock, Mountain, Ruler, Sun, Star, CheckSquare } from "lucide-react";
import {extractDate } from '../utils/hikeDates'
import { useParams} from "react-router-dom";
import { useEffect, useState } from "react";
import { hikeDataCollection } from "../context/hikeDataContext";
import { NotesDataCollection } from "../context/NotesContext";
import { GoalDataCollection } from "../context/GoalsContext";
import { UserDataCollection } from "../context/UsersContext";
import { UserAuth } from "../context/AuthContext";






export default function HikeLogbookPage() {

  const { hikeid } = useParams();
  const [hike,setHike]= useState(null)
  const[notes,setNotes]= useState([])
  const[goals,setGoals]= useState([])
  const[date,setDate]= useState([])
  const[weather,setWeather]= useState(["-","-"])
  const [members,setMembers]= useState([])
  const [error, setError] = useState("");
  const [coords, setCoords] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [currentCoords, setCurrentCoords] = useState(null);
  

  const {getHike} = hikeDataCollection()
  const {getNotes}= NotesDataCollection()
  const {getGoals}= GoalDataCollection()
  const {getUser}= UserDataCollection()
  const {currentUser,authLoading}= UserAuth()
  //const {getCoordinates}= hikeDataCollection()




  


  const handleDate=(startDate,endDate)=>{
    const S=extractDate(startDate)
 
    const start = new Date(startDate);
    const end = new Date(endDate);

    const diff= end-start
    const diffMinutes= Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60

   const duration = `${hours}h ${minutes}m`;




    setDate([`${S.date}, ${S.time}`,duration])

  }

  



  const handleWeather=(weather)=>{

    setWeather(`${weather.discription},${weather.temperature}`)

  }


  const handleHike= async(hike_id,user_id)=>{
    try {
      let res = await getHike(hike_id,user_id);
      res=res[0]


      const [notesData, goalsData, membersData] = await Promise.all([
        getNotes(hike_id,user_id),
        getGoals(hike_id,user_id),
        Promise.all(res.hikinggroup.members.map(id => getUser(id))),
      ])

      setNotes(notesData);
      setGoals(goalsData);
      setMembers( membersData.map(tmp => tmp?.name || tmp?.firstname || "missing name"));

      handleDate(res.startdate,res.enddate);
      handleWeather(res.weather)


      setHike(res);
  } catch (err) {
      setError("Failed to load hike data.");
    } finally {
      setPageLoading(false);
    }


  }  

  
  useEffect(()=>{
if(!authLoading){
    if(!hike && currentUser){    
      handleHike(hikeid,currentUser.id);
    }else{
      setPageLoading(false);
    }
  }
  
  },[hikeid,currentUser?.id,authLoading])





if (pageLoading || authLoading){
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600 italic">Loading log entry...</p>
      </div>
    );
  }


  if (error){
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }


  if (!hike){
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 italic">No hike data found.</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center font-serif">
      <div className="w-full max-w-6xl shadow-lg border-2 border-gray-800 bg-white rounded-2xl grid grid-cols-1 md:grid-cols-2">

        <div className="border-r border-gray-800 p-6 space-y-6">
          <div className="border-b border-gray-800 pb-4">
            <h1 className="text-3xl font-bold text-black text-center">
               {hike?.title|| "Loading..."}
            </h1>
            <p className="text-center text-gray-600 italic">{hike?.location|| "Loading..."}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <LogItem icon={<Calendar />} label="Start Date" value={date[0] || "-"} />
            <LogItem icon={<Clock />} label="Time Taken" value={date[1]|| "-"} />
            <LogItem icon={<Ruler />} label="Distance" value={hike?.distance+"m" || "-"} />
            <LogItem icon={<Mountain />} label="Highest Elevation" value={hike?.elevation+"m"|| "-"} />
            <LogItem icon={<Star />} label="Difficulty" value={hike?.difficulty|| "-"} />
            <LogItem icon={<Sun />} label="Weather" value={weather+"*C"|| "-"} />
          </div>

          <div >
            <h3 className="text-xl font-semibold text-black flex items-center gap-2">
              <CheckSquare className="w-5 h-5" /> Hike Goals
            </h3>
            <ul className="space-y-2 mt-2 max-h-48 overflow-y-auto pr-2">

              {goals.length > 0 ? (
              goals.map((entry,idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700">
                  <input type="checkbox" checked={entry.status=="complete"} disabled className="accent-gray-700" />
                  <span className={entry.status=="complete" ? "line-through text-gray-500" : ""}>{entry.goal}</span>
                </li>
              ))
            ):(<p className="text-gray-500 italic">No goals added yet.</p>)}
            </ul>
          </div>

          <div >
            <h3 className="text-xl font-semibold text-black flex items-center gap-2 ">
              <Users className="w-5 h-5" /> Hikers Joined
            </h3>
            <ul className="list-disc list-inside text-gray-700 pl-2 mt-2 max-h-25 overflow-y-auto pr-2">
              {members.length > 0 ? (
              members.map((person, idx) => (<li key={idx}>{person}</li>))
              ):(<p className="text-gray-500 italic">No members found.</p>)}
            </ul>
          </div>
        </div>


        <div className="p-6 flex flex-col">
          <h2 className="text-2xl font-bold text-black border-b border-gray-800 pb-2">Hike Notes</h2>
          <div className="mt-4 space-y-4 overflow-y-auto max-h-[32rem] pr-2">
            {notes.length > 0 ? (
            notes.map((note, idx) => (
              <div key={idx} className="bg-gray-100 border border-gray-400 rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">{note.date}</p>
                <p className="mt-1 text-gray-800">{note.text}</p>
              </div>
            ))):(<p className="text-gray-500 italic">No notes recorded yet.</p>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function LogItem({ icon, label, value }) {
  return (
    <div className="bg-gray-200 border border-gray-700 rounded-xl p-3 shadow-sm">
      <div className="flex items-center gap-2 text-black font-semibold">
        {icon} {label}
      </div>
      <p className="mt-1 text-gray-700 italic">{value}</p>
    </div>
  );
}


