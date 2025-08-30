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






    return (
        <HikeDataContext.Provider value={{getCompletedHikesData,getCurrentHikeData}}>
            {children}
        </HikeDataContext.Provider>
    )

}

export const hikeDataCollection=()=>{

        return useContext(HikeDataContext);
}

