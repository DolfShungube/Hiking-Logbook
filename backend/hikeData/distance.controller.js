const { createClient } = require("@supabase/supabase-js");


const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabasekey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabasekey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});



// this fetcgUserRoutes function works
const fetchUserRoutes = async (userid) => {
  const { data, error } = await supabase
    .from("HikeData")
    .select("route")
    .eq("userid", userid)
    .eq("status", "in progress")
    .single();
    

  if (error) {
    throw new Error(error.message);
  }
  data.route = data.route.trim();
  return data;
};


// FETCH functions for start and end coordinates of hikes
//
const coordinates = async (req, res) => {
    const { userid } = req.params;


    const routeData = await fetchUserRoutes(userid);
   //.single(), Supabase will always return an object like: { "route": "18d95307-30db-403f-b1fe-a934c30ed30b" }

    
    if (!routeData || !routeData.route) {
        return res.status(404).json({ error: "No route found for this user" });
    }

    const routeId = routeData.route;

    const { data:pathRow,error} = await supabase
    .from("routes")
    .select("path")
    .eq("routeid", routeId)
    .single();
    

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    let coordinates = pathRow.path.features[0].geometry.coordinates;

    if (pathRow.path.features[0].geometry.type === "MultiLineString") {
      coordinates = coordinates.flat();
    }


    const StartCoordinates = coordinates[0].slice(0, 2);
    const EndCoordinates = coordinates[coordinates.length - 1].slice(0, 2);

    
    
    res.status(200).json({
        message:"Fetched start coordinates successfully",
        start:StartCoordinates,
        end: EndCoordinates, // Assuming path is an array of coordinate
    });

  
};



module.exports = {
  coordinates,
  fetchUserRoutes
};