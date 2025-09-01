const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabasekey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabasekey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// FETCH functions - use userid to get ALL hikes for a user
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
    return res.status(500).json({ error: "Something went wrong" });
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
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const fetchPlannedHikes = async (req, res) => {
  const { userid } = req.query;
  try {
    const { data: sentData, error: sentError } = await supabase
      .from("HikeData")
      .select("*")
      .eq("userid", userid)
      .eq("status", "planned")
      .order("startdate", { ascending: true });

    if (sentError) {
      console.error("Error while fetching planned hikes:", sentError);
      return res.status(500).json({ error: sentError.message });
    }

    return res.status(200).json({ 
      message: "planned hikes fetched successfully", 
      data: sentData 
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Something went wrong" });
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
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// EDIT/DELETE functions - use hikeid to target SPECIFIC hikes
const editPlannedHike = async (req, res) => {
  const { hikeId } = req.params; // This is the hikeid (primary key)
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
    return res.status(500).json({ error: "Something went wrong" });
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
    return res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  fetchCompletedHikes,
  fetchCurrentHike,
  fetchPlannedHikes,
  fetchHike,
  editPlannedHike,
  deletePlannedHike
};
