const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabasekey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabasekey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Helper function to get image based on location
const getImageForLocation = (location) => {
  if (!location) return 'https://images.unsplash.com/photo-1648804536048-0a7d8b103bbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb3VudGFpbiUyMGhpa2luZyUyMHRyYWlsJTIwc2NlbmljfGVufDF8fHx8MTc1NjIxNjU5Nnww&ixlib=rb-4.1.0&q=80&w=1080';
  
  const locationLower = location.toLowerCase();
  
  if (locationLower.includes('yosemite')) {
    return 'https://images.unsplash.com/photo-1688602905494-5feda601966d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3NlbWl0ZSUyMGhhbGYlMjBkb21lJTIwdHJhaWx8ZW58MXx8fHwxNzU2MzI3MDg4fDA&ixlib=rb-4.1.0&q=80&w=1080';
  } else if (locationLower.includes('zion')) {
    return 'https://images.unsplash.com/photo-1686347858432-c385c54f9dff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmdlbHMlMjBsYW5kaW5nJTIwemlvbiUyMHRyYWlsfGVufDF8fHx8MTc1NjMyNzA5MXww&ixlib=rb-4.1.0&q=80&w=1080';
  } else if (locationLower.includes('grand canyon')) {
    return 'https://images.unsplash.com/photo-1649786037057-8b1f92bdde95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxncmFuZCUyMGNhbnlvbiUyMGJyaWdodCUyMGFuZ2VsJTIwdHJhaWx8ZW58MXx8fHwxNzU2MzI3MDk1fDA&ixlib=rb-4.1.0&q=80&w=1080';
  } else if (locationLower.includes('white mountains')) {
    return 'https://images.unsplash.com/photo-1558483754-4618fc25fe5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxhcHBhbGFjaGlhbiUyMHRyYWlsJTIwbW91bnRhaW5zfGVufDF8fHx8MTc1NjMyNzA5OHww&ixlib=rb-4.1.0&q=80&w=1080';
  } else if (locationLower.includes('rainier')) {
    return 'https://images.unsplash.com/photo-1572573022597-3da22e56ff39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb3VudCUyMHJhaW5pZXIlMjB3b25kZXJsYW5kJTIwdHJhaWx8ZW58MXx8fHwxNzU2MzI3MTAxfDA&ixlib=rb-4.1.0&q=80&w=1080';
  } else if (locationLower.includes('denali')) {
    return 'https://images.unsplash.com/photo-1648804536048-0a7d8b103bbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb3VudGFpbiUyMGhpa2luZyUyMHRyYWlsJTIwc2NlbmljfGVufDF8fHx8MTc1NjIxNjU5Nnww&ixlib=rb-4.1.0&q=80&w=1080';
  }
  
  // Default mountain image
  return 'https://images.unsplash.com/photo-1648804536048-0a7d8b103bbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb3VudGFpbiUyMGhpa2luZyUyMHRyYWlsJTIwc2NlbmljfGVufDF8fHx8MTc1NjIxNjU5Nnww&ixlib=rb-4.1.0&q=80&w=1080';
};

// Helper function to calculate attendees count
const calculateAttendeesCount = (hikinggroup) => {
  let attendeesCount = 1; // Start with 1 for the hike organizer
  
  if (hikinggroup && typeof hikinggroup === 'object') {
    if (hikinggroup.members && Array.isArray(hikinggroup.members)) {
      attendeesCount += hikinggroup.members.length;
    }
  }
  
  return attendeesCount;
};

// Helper function to extract time from datetime
const extractTimeFromDate = (dateString) => {
  if (!dateString) return '00:00';
  
  try {
    const date = new Date(dateString);
    return date.toTimeString().slice(0, 5); // Returns HH:MM format
  } catch (error) {
    console.error('Error parsing time from date:', error);
    return '00:00';
  }
};

// Enhanced fetchPlannedHikes function
const fetchPlannedHikes = async (req, res) => {
  const { userid } = req.query;
  
  if (!userid) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const { data: sentData, error: sentError } = await supabase
      .from("HikeData")
      .select("*")
      .eq("userid", userid)
      .eq("status", "planned")
      .gte("startdate", new Date().toISOString().split('T')[0]) // Only future hikes
      .order("startdate", { ascending: true });

    if (sentError) {
      console.error("Error while fetching planned hikes:", sentError);
      return res.status(500).json({ error: sentError.message });
    }

    // Transform the data to match frontend expectations
    const transformedHikes = sentData.map(hike => {
      const startDate = new Date(hike.startdate);
      
      return {
        id: hike.hikeid,
        title: hike.title || 'Unnamed Hike',
        location: hike.location || 'Unknown Location',
        date: hike.startdate ? hike.startdate.split('T')[0] : '', // YYYY-MM-DD format
        time: extractTimeFromDate(hike.startdate),
        status: hike.status || 'planned',
        attendees: calculateAttendeesCount(hike.hikinggroup),
        difficulty: hike.difficulty || 'moderate',
        distance: hike.distance || null,
        elevation: hike.elevation || null,
        image: getImageForLocation(hike.location),
        weather: hike.weather || null,
        hikinggroup: hike.hikinggroup || null,
        route: hike.route || null
      };
    });

    return res.status(200).json({ 
      message: "planned hikes fetched successfully", 
      data: transformedHikes 
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Fail" });
  }
};

// Alternative function to get all hikes (planned, completed, in progress)
const fetchAllHikes = async (req, res) => {
  const { userid } = req.query;
  
  if (!userid) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const { data: sentData, error: sentError } = await supabase
      .from("HikeData")
      .select("*")
      .eq("userid", userid)
      .order("startdate", { ascending: false }); // Most recent first

    if (sentError) {
      console.error("Error while fetching all hikes:", sentError);
      return res.status(500).json({ error: sentError.message });
    }

    const transformedHikes = sentData.map(hike => ({
      id: hike.hikeid,
      title: hike.title || 'Unnamed Hike',
      location: hike.location || 'Unknown Location',
      date: hike.startdate ? hike.startdate.split('T')[0] : '',
      time: extractTimeFromDate(hike.startdate),
      status: hike.status || 'planned',
      attendees: calculateAttendeesCount(hike.hikinggroup),
      difficulty: hike.difficulty || 'moderate',
      distance: hike.distance || null,
      elevation: hike.elevation || null,
      image: getImageForLocation(hike.location),
      weather: hike.weather || null,
      hikinggroup: hike.hikinggroup || null,
      route: hike.route || null
    }));

    return res.status(200).json({ 
      message: "all hikes fetched successfully", 
      data: transformedHikes 
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Fail" });
  }
};

// Keep all your existing functions
const fetchCompletedHikes = async (req, res) => {
  const { userid } = req.query;
  try {
    const { data: sentData, error: sentError } = await supabase
      .from("HikeData")
      .select("*")
      .eq("userid", userid) 
      .eq("status", "complete");

    if (sentError) {
      console.error("Error while fetching completed hikes:", sentError);
      return res.status(500).json({ error: sentError.message });
    }

    return res.status(200).json({ 
      message: "completed hikes fetched successfully", 
      data: sentData 
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Fail" });
  }
};

const fetchCurrentHike = async (req, res) => {
  const { userid } = req.query;
  try {
    const { data: sentData, error: sentError } = await supabase
      .from("HikeData")
      .select("*")
      .eq("userid", userid)
      .eq("status", "in progress");

    if (sentError) {
      console.error("Error while fetching the hike:", sentError);
      return res.status(500).json({ error: sentError.message });
    }

    return res.status(200).json({ 
      message: "current hike fetched successfully", 
      data: sentData 
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Fail" });
  }
};

const fetchHike = async (req, res) => {
  const { hikeid } = req.query;
  try {
    const { data: sentData, error: sentError } = await supabase
      .from("HikeData")
      .select("*")
      .eq("hikeid", hikeid);
        
    if (sentError) {
      console.error("Error while fetching the hike:", sentError);
      return res.status(500).json({ error: sentError.message });
    }

    return res.status(200).json({ 
      message: "current hike fetched successfully", 
      data: sentData 
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Fail" });
  }
};

const editPlannedHike = async (req, res) => {
  const { hikeId } = req.params;
  const updateData = req.body;

  try {
    const { data: existingHike, error: fetchError } = await supabase
      .from("HikeData")
      .select("*")
      .eq("hikeid", hikeId)
      .single();

    if (fetchError || !existingHike) {
      return res.status(404).json({ 
        error: "Hike not found" 
      });
    }

    const { data: updatedData, error: updateError } = await supabase
      .from("HikeData")
      .update(updateData)
      .eq("hikeid", hikeId)
      .select();

    if (updateError) {
      console.error("Error while updating hike:", updateError);
      return res.status(500).json({ error: updateError.message });
    }

    return res.status(200).json({
      message: "Hike updated successfully",
      hike: updatedData[0]
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Fail" });
  }
};

const deletePlannedHike = async (req, res) => {
  const { hikeId } = req.params;

  try {
    const { data: existingHike, error: fetchError } = await supabase
      .from("HikeData")
      .select("*")
      .eq("hikeid", hikeId)
      .single();

    if (fetchError || !existingHike) {
      return res.status(404).json({ 
        error: "Hike not found" 
      });
    }

    const { error: deleteError } = await supabase
      .from("HikeData")
      .delete()
      .eq("hikeid", hikeId);

    if (deleteError) {
      console.error("Error while deleting hike:", deleteError);
      return res.status(500).json({ error: deleteError.message });
    }

    return res.status(200).json({
      message: "Hike deleted successfully",
      deletedHikeId: hikeId
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Fail" });
  }
};

module.exports = {
  fetchCompletedHikes,
  fetchCurrentHike,
  fetchPlannedHikes,
  fetchAllHikes, // New function
  fetchHike,
  editPlannedHike,
  deletePlannedHike
};
