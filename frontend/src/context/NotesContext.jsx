import { createContext, useContext} from "react";

const NotesDataContext= createContext(null);

 export const NotesDataContextProvider=({children})=>{

    const getNotes= async(hike_id)=>{

        try {
            const res= await fetch(
                `https://hiking-logbook-api.onrender.com/get-notes?hikeid=${encodeURIComponent(hike_id)}`,{
                method:"GET",
            })

            const data = await res.json();

            if(!res.ok){
                console.error("Error fetching goals:", data.error);
                throw new Error(data.error || "Failed to fetch  goals");
            }
            console.log(data.data[0].notes)
            return data?.data[0]?.notes?.notes;
            
        } catch (err) {
        console.error("fetching error:", err);
            throw err;            
        }

    }    






    return (
        <NotesDataContext.Provider value={{getNotes}}>
            {children}
        </NotesDataContext.Provider>
    )

}

export const NotesDataCollection=()=>{
        return useContext(NotesDataContext);
}
