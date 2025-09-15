import { createContext, useContext} from "react";

const GoalDataContext= createContext(null);

 export const GoalDataContextProvider=({children})=>{

    const getGoals= async(hike_id,userid)=>{

        try {
            const res= await fetch(
                `https://hiking-logbook-api.onrender.com/get-goals?hikeid=${encodeURIComponent(hike_id)}&userid=${encodeURIComponent(userid)}`,{
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


const addGoal = async (hike_id,goal,userid) => {
  try {

    const res = await fetch('https://hiking-logbook-api.onrender.com/add-goal', {
    
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        hikeid:hike_id,
        goalDiscription:goal,
        goalStatus: "in progress",
        userid:userid
      })
    });

    const data = await res.json();

    if (!res.ok) {
      return data
      throw new Error(`HTTP error! Status: ${res.status}`);
    }







    return data;
  } catch (err) {
    console.error("error:", err);
    throw err;
  }
};



const updateGoalStatus = async (hike_id,goal,newStatus,userid) => {
  try {

    const res = await fetch('https://hiking-logbook-api.onrender.com/update-goal-status', {
    
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        hikeid:hike_id,
        goalDiscription:goal,
        goalStatus: newStatus,
        userid:userid
      })
    });

    const data = await res.json();

    if (!res.ok) {
      return data
      throw new Error(`HTTP error! Status: ${res.status}`);
    }


    return data;
  } catch (err) {
    console.error("error:", err);
    throw err;
  }
};
const deleteGoal = async (hike_id,goal,userid) => {
  try {

    const res = await fetch('https://hiking-logbook-api.onrender.com/delete-goal', {
    
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        hikeid:hike_id,
        goalDiscription:goal,
        userid:userid
      })
    });

    const data = await res.json();

    if (!res.ok) {
      return data
      throw new Error(`HTTP error! Status: ${res.status}`);
    }


    return data;
  } catch (err) {
    console.error("error:", err);
    throw err;
  }
};


    return (
        <GoalDataContext.Provider value={{getGoals,addGoal,updateGoalStatus,deleteGoal}}>
            {children}
        </GoalDataContext.Provider>
    )

}

export const GoalDataCollection=()=>{
        return useContext(GoalDataContext);
}
