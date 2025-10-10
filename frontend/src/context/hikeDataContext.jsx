import { createContext, useContext, useState } from "react";

const HikeDataContext= createContext(null);

 export const HikeDataContextProvider=({children})=>{
    


    const [hikeData,setHikeData]= useState()


    const getCompletedHikesData= async(user_id)=>{

        try {

            const res= await fetch(
                `https://hiking-logbook-api.onrender.com/completed-hikes?userid=${encodeURIComponent(user_id)}`,{
                method:"GET",
            })

            const data = await res.json();

            if(!res.ok){
                console.error("Error fetching completed hikes:", data.error);
                throw new Error(data.error || "Failed to fetch completed hikes");
            }

            return data;
            
        } catch (err) {
        console.error("fetching error:", err);
            throw err;            
        }

    }


    const getCurrentHikeData= async(user_id)=>{

        try {
            const res= await fetch(
                `https://hiking-logbook-api.onrender.com/current-hike?userid=${encodeURIComponent(user_id)}`,{
                method:"GET",
            })

            const data = await res.json();

            if(!res.ok){
                console.error("Error fetching current hike:", data.error);
                throw new Error(data.error || "Failed to fetch completed hike");
            }

            return data;
            
        } catch (err) {
        console.error("fetching error:", err);
            throw err;            
        }

    }


    const getHike= async(hike_id,user_id)=>{


        try {
            const res= await fetch(
                `https://hiking-logbook-api.onrender.com/get-hike?hikeid=${encodeURIComponent(hike_id)}&userid=${encodeURIComponent(user_id)}`,{
                method:"GET",
            })

            const data = await res.json();

            if(!res.ok){
                console.error("Error fetching hike:", data.error);
                throw new Error(data.error || "Failed to fetch  hike");
            }

            return data.data;
            
        } catch (err) {
        console.error("fetching error:", err);
            throw err;            
        }

    }    

    // this is just a function I will use in my frontend to get the coordinates of the route for the current hike
    
    const getCoordinates= async(userid)=>{

        try {
            const res= await fetch(`http://localhost:8080/coordinates/${userid}`);
            const data = await res.json();
            if(!res.ok){
                console.error("Error coordinates data:", data.error);
                throw new Error(data.error || "Failed to fetch  coordinates data");
            }
            
            return data;

            //this return the start and end coordinates
            //{message: 'Fetched start coordinates successfully', start: [Array], end: [Array]}
            
        } catch (err) {
        console.error("fetching error:", err);
            throw err;            
        }

    } 


const createNewHike = async(userid,startdate,location,weather,elevation,route,mystatus,
                                distance,hikinggroup,difficulty,title) =>{
  try {

    const res = await fetch('https://hiking-logbook-api.onrender.com/newHike', {
    
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userid:userid,   
        startdate:startdate,
        enddate:startdate,          
        location:location,
        weather:weather,
        elevation:elevation,                  
        route:route,
        status:mystatus,             
        distance:distance,                    
        hikinggroup:hikinggroup,
        difficulty:difficulty,
        title:title
      })
    });

    const data = await res.json();

    if (!res.ok) {
        console.log(res)
        throw new Error(`HTTP error! Status: ${res.status}`);

    }

    return data;
  } catch (err) {
    console.error("error:", err);
    throw err;
  }
}; 


const updateHike= async(hikeid,userid,myData) =>{
  try {

    const res = await fetch(`https://hiking-logbook-api.onrender.com/planned-hikes/${encodeURIComponent(hikeid)}/${encodeURIComponent(userid)}`, {
    
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(myData)
    });

    const data = await res.json();

    if (!res.ok) {
        console.log(res)
        throw new Error(`HTTP error! Status: ${res.status}`);

    }

    return data;
  } catch (err) {
    console.error("error:", err);
    throw err;
  }
};    

const saveHikeStats = async(userid, distance, locations, hours) =>{
    try{
        //https://hiking-logbook-api.onrender.com/saveStats
        const res = await fetch(
            'http://localhost:8080/saveStats',{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: userid,
                    distance: distance,
                    locations: locations,
                    hours: hours
                })
            }
        );

        const data = await res.json();
        return data;
    }catch(err){
        console.error("error:", err);
        throw err;        
    }
}


const updateHikeStatus= async(hikeId,userId,status) =>{
    try {
        const res = await fetch('http://localhost:8080/update-hike-status', {
            method: "PUT",
            headers: {
                    "Content-Type": "application/json"
                }, body: JSON.stringify({
                    hikeId,
                    userId,
                    status
                })
        });
        if (!res.ok) {
            const errorText = await res.text();
            console.error(`HTTP error! Status: ${res.status}`, errorText);
            throw new Error(`HTTP error! Status: ${res.status}. Server response: ${errorText}`);     
        }
        const data = await res.json();
        return data;
        //return { message: "Hike status updated successfully" };
    }catch (err) {
        console.error("Fetch failed or unexpected error:",err);
        console.log("Failed to update hike status");
        throw err;
    }
}



    






    return (
        <HikeDataContext.Provider value={{getCompletedHikesData,getCurrentHikeData,getHike,getCoordinates,createNewHike,updateHike,saveHikeStats,updateHikeStatus}}>
            {children}
        </HikeDataContext.Provider>
    )

}

export const hikeDataCollection=()=>{

        return useContext(HikeDataContext);
}

