const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabasekey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabasekey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// ADD BOOKMARK - Insert a hike into bookmarks
const addBookmark = async (req, res) => {
  const { hikeid, userid } = req.body;

  if (!hikeid || !userid) {
    return res.status(400).json({ 
      error: "Both hikeid and userid are required" 
    });
  }

  try {
    // Check if bookmark already exists
    const { data: existingBookmark, error: checkError } = await supabase
      .from("BookmarkedHikes")
      .select("*")
      .eq("hikeid", hikeid)
      .eq("userid", userid)
      .single();

    if (existingBookmark) {
      return res.status(409).json({ 
        error: "Hike is already bookmarked" 
      });
    }

    // Insert new bookmark
    const { data: bookmarkData, error: insertError } = await supabase
      .from("BookmarkedHikes")
      .insert([{ 
        hikeid: hikeid,
        userid: userid 
      }])
      .select();

    if (insertError) {
      console.error("Error while adding bookmark:", insertError);
      return res.status(500).json({ error: insertError.message });
    }

    return res.status(201).json({
      message: "Bookmark added successfully",
      bookmark: bookmarkData[0]
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// REMOVE BOOKMARK - Delete a hike from bookmarks
const removeBookmark = async (req, res) => {
  const { hikeid, userid } = req.params;

  if (!hikeid || !userid) {
    return res.status(400).json({ 
      error: "Both hikeid and userid are required" 
    });
  }

  try {
    // Check if bookmark exists
    const { data: existingBookmark, error: fetchError } = await supabase
      .from("BookmarkedHikes")
      .select("*")
      .eq("hikeid", hikeid)
      .eq("userid", userid)
      .single();

    if (fetchError || !existingBookmark) {
      return res.status(404).json({ 
        error: "Bookmark not found" 
      });
    }

    // Delete the bookmark
    const { error: deleteError } = await supabase
      .from("BookmarkedHikes")
      .delete()
      .eq("hikeid", hikeid)
      .eq("userid", userid);

    if (deleteError) {
      console.error("Error while removing bookmark:", deleteError);
      return res.status(500).json({ error: deleteError.message });
    }

    return res.status(200).json({
      message: "Bookmark removed successfully",
      deletedBookmark: { hikeid, userid }
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// FETCH BOOKMARKED HIKES - Get all bookmarked hikes for a user with full hike details
const fetchBookmarkedHikes = async (req, res) => {
  const { userid } = req.query;

  if (!userid) {
    return res.status(400).json({ 
      error: "userid is required" 
    });
  }

  try {
    // Get all bookmarks for the user and join with HikeData to get full hike details
    const { data: bookmarkedData, error: bookmarkError } = await supabase
      .from("BookmarkedHikes")
      .select(`
        hikeid,
        userid,
        created_at,
        HikeData (*)
      `)
      .eq("userid", userid);

    if (bookmarkError) {
      console.error("Error while fetching bookmarked hikes:", bookmarkError);
      return res.status(500).json({ error: bookmarkError.message });
    }

    // Transform the data to match the format of fetchCompletedHikes
    const transformedData = bookmarkedData.map(bookmark => ({
      ...bookmark.HikeData,
      bookmarked_at: bookmark.created_at
    }));

    return res.status(200).json({ 
      message: "Bookmarked hikes fetched successfully", 
      data: transformedData 
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  addBookmark,
  removeBookmark,
  fetchBookmarkedHikes
};