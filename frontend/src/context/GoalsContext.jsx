import { createContext, useContext} from "react";

const GoalDataContext= createContext(null);

 export const GoalDataContextProvider=({children})=>{

    const getGoals= async(hike_id)=>{

        try {
            const res= await fetch(
                `https://hiking-logbook-api.onrender.com/get-goals?hikeid=${encodeURIComponent(hike_id)}`,{
                method:"GET",
            })

            const data = await res.json();

            if(!res.ok){
                console.error("Error fetching goals:", data.error);
                throw new Error(data.error || "Failed to fetch  goals");
            }

           
            return data?.data[0]?.goals?.goals || [];
            
            
        } catch (err) {
        console.error("fetching error:", err);
            throw err;            
        }

    }    






    return (
        <GoalDataContext.Provider value={{getGoals}}>
            {children}
        </GoalDataContext.Provider>
    )

}

export const GoalDataCollection=()=>{
        return useContext(GoalDataContext);
}
