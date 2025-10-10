// backend/hikeData/distance.controller.js
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabasekey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabasekey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// fetchUserRoutes: return null when no route found, throw on DB errors
const fetchUserRoutes = async (userid) => {
  const { data, error } = await supabase
    .from("HikeData")
    .select("route,location")
    .eq("userid", userid)
    .eq("status", "in progress")
    .single();

  // If Supabase reports an error...
  if (error) {
    // Treat "no rows" / not found as not-an-error for our purposes -> return null
    // Supabase PostgREST may include text like "No rows found" or code PGRST116 depending on version
    const msg = (error.message || "").toLowerCase();
    const isNoRows = msg.includes("no rows") || msg.includes("not found") || error.code === "PGRST116";
    if (isNoRows) {
      return null;
    }
    // For other DB errors, bubble up
    throw new Error(error.message);
  }

  // If no data returned (explicitly null), treat as not found
  if (!data) return null;

  // Safely trim route if it exists and is a string
  if (data.route && typeof data.route === "string") {
    data.route = data.route.trim();
  }

  return data;
};

// coordinates controller
const coordinates = async (req, res) => {
  try {
    const { userid } = req.params;
    console.log("Fetching coordinates for userid:", userid);

    const routeData = await fetchUserRoutes(userid);

    // If fetchUserRoutes returned null => no route found
    if (!routeData || !routeData.route) {
      return res.status(404).json({ error: "No route found for this user" });
    }

    const routeId = routeData.route;
    const userLocation = routeData.location || "Unknown";

    const { data: pathRow, error } = await supabase
      .from("routes")
      .select("path,difficulty")
      .eq("routeid", routeId)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(400).json({ error: error.message });
    }

    // Paths may be LineString or MultiLineString
    let coordinates = pathRow.path.features[0].geometry.coordinates;
    if (pathRow.path.features[0].geometry.type === "MultiLineString") {
      coordinates = coordinates.flat();
    }

    // keep only lon/lat
    coordinates = coordinates.map(coord => coord.slice(0, 2));
    const StartCoordinates = coordinates[0].slice(0, 2);
    const EndCoordinates = coordinates[coordinates.length - 1].slice(0, 2);

    res.status(200).json({
      message: "Fetched start coordinates successfully",
      start: StartCoordinates,
      end: EndCoordinates,
      difficulty: pathRow.difficulty || "Unknown",
      path: coordinates, // send all points along the route
      location: userLocation,
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
