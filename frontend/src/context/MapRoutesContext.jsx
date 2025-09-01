import { createContext, useContext} from "react";

const RouteDataContext= createContext(null);

 export const RouteDataContextProvider=({children})=>{

    const getRouteJson= async(route_id)=>{

        try {
            const res= await fetch(
                `https://hiking-logbook-api.onrender.com/get-route?routeid=${encodeURIComponent(route_id)}`,{
                method:"GET",
            })

            const data = await res.json();

            if(!res.ok){
                console.error("Error fetching user:", data.error);
                throw new Error(data.error || "Failed to fetch  user");
            }
            return data.data;
            
        } catch (err) {
        console.error("fetching error:", err);
            throw err;            
        }

    }    






    return (
        <RouteDataContext.Provider value={{getRouteJson}}>
            {children}
        </RouteDataContext.Provider>
    )

}

export const RouteDataCollection=()=>{
        return useContext(RouteDataContext);
}