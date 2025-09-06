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
  try {
    const { userid } = req.params;
    console.log("Fetching coordinates for userid:", userid);

    const routeData = await fetchUserRoutes(userid);

    if (!routeData || !routeData.route) {
      return res.status(404).json({ error: "No route found for this user" });
    }

    const routeId = routeData.route;

    const { data: pathRow, error } = await supabase
      .from("routes")
      .select("path,difficulty")
      .eq("routeid", routeId)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(400).json({ error: error.message });
    }

    let coordinates = pathRow.path.features[0].geometry.coordinates;

    if (pathRow.path.features[0].geometry.type === "MultiLineString") {
      coordinates = coordinates.flat();
    }

    const StartCoordinates = coordinates[0].slice(0, 2);
    const EndCoordinates = coordinates[coordinates.length - 1].slice(0, 2);

    res.status(200).json({
      message: "Fetched start coordinates successfully",
      start: StartCoordinates,
      end: EndCoordinates,
      difficulty: pathRow.difficulty || "Unknown", // add difficulty here
    });

  } catch (err) {
    console.error("Coordinates endpoint error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};







module.exports = {
  coordinates,
  fetchUserRoutes
};