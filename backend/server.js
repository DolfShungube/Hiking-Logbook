const express = require("express");
const path = require("path");
const dotenv = require('dotenv/config');
const { createClient } = require("@supabase/supabase-js");
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());

const weatherRouter = require("./endpoints/weatherAPI.js");
const { inviteFriend, acceptInvite, rejectInvite, getFriends, hikeInviteFriend, acceptHikeInvite, rejectHikeInvite} = require("./friends/friends.controller");
const { signIn, signInWithGoogle, signUp } = require("./auth/auth.controller");
//CreateNewHike,fetchHike, fetchPlannedHikes, editPlannedHike, deletePlannedHike
const { fetchCompletedHikes, CreateNewHike, fetchCurrentHike,deletePlannedHike,editPlannedHike,fetchHike,fetchPlannedHikes,saveHikeStats,updateHikeStatus} = require("./hikeData/hikes.controller");
//const { CreateNewHike } = require("./hikeData/CreateNewHike");
const { coordinates } = require("./hikeData/distance.controller.js");
const { fetchUserRoutes } = require("./hikeData/distance.controller.js");
const bookmarkController = require('./hikeData/Bookmark.controller');

//const { fetchHike, fetchPlannedHikes, editPlannedHike} = require("./hikeData/plannedHikes_details.js");
const { fetchUser, getUserByName } = require("./users/users.controller");
const { getNotes, addNotes, removeNotes } = require("./notes/notes.controller");
const { getGoals, addGoal, updateGoalStatus, removeGoal } = require("./goals/goals.controller");
const { getRoute ,  getAllRoutes } = require("./routes/routes.controller");


app.use(cors({ origin: true, credentials: true }));
app.get("/", (req, res) => {
  res.send("Server is running..");
});

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabasekey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabasekey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

app.get("/get-user", fetchUser);
app.get("/get-user-by-name",getUserByName);

app.post("/invite-friend", inviteFriend);
app.post("/accept-invite", acceptInvite);
app.post("/reject-invite", rejectInvite);
app.get("/get-friends", getFriends);
app.post("/invite-friend-hike",hikeInviteFriend)
app.post("/accept-hike-invite",acceptHikeInvite)
app.post("/reject-hike-invite",rejectHikeInvite)


app.post("/signup", signUp);
app.post("/signin", signIn);
app.post("/googlesignin", signInWithGoogle);


app.post("/newHike", CreateNewHike);
app.get("/completed-hikes", fetchCompletedHikes);
app.get("/current-hike", fetchCurrentHike);
app.get("/get-hike", fetchHike);

app.get("/get-notes", getNotes);  // gets notes based on hikeid
app.post("/add-note", addNotes);   // add a new note using hikeid and the nte
app.post("/remove-note", removeNotes);  // remove a notes item



app.get("/get-goals", getGoals);
app.post("/add-goal",addGoal)
app.post("/update-goal-status",updateGoalStatus)
app.post("/delete-goal",removeGoal)
app.post("/saveStats",saveHikeStats)


app.get("/planned-hikes", fetchPlannedHikes);
app.put("/planned-hikes/:hikeId/:userid", editPlannedHike);
app.delete("/planned-hikes/:hikeId/:userid", deletePlannedHike);

app.get("/get-route",getRoute);
app.get("/get-all-routes", getAllRoutes);
app.get("/coordinates/:userid", coordinates);
app.use("/api/weather",weatherRouter);
app.put("/update-hike-status", updateHikeStatus);

app.post("/bookmarks", bookmarkController.addBookmark);
app.delete("/bookmarks/:hikeid/:userid", bookmarkController.removeBookmark);
app.get("/bookmarks", bookmarkController.fetchBookmarkedHikes);


app.listen(port, "0.0.0.0", () => {
});





app.get("/hikes", async (req, res) => {
  const { data, error } = await supabase
    .from("hikingStats")
    .select("*")
    .order("startdate", { ascending: false });

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(200).json({
    message: "Fetched all hikes",
    hikes: data
  });
});


//API to handle hikesStatus update to completed



module.exports = app;


//API to get all hikeId for a specific user to update the status later
app.get("/userHikeId/:userid", async (req, res) =>{
  let { userid } = req.params;
  userid = userid.trim();
  const {data, error } = await supabase
  .from("HikeData")
  .select("hikeid")
  .eq("userid", userid)
  .eq("status", "in progress");
  
  if (error) {
    return res.status(500).json({ error: error.message });
    
  }
  //console.log("Query result:", data);
  res.status(200).json({
    message: "Fetched all hikes for user",
    hikes:data,
  });
  });


  //TEST

  // Test endpoint to fetch user's route
/*app.get("/test-fetch-route/:userid", async (req, res) => {
  const { userid } = req.params;
  

  try {
    const routeData = await fetchUserRoutes(userid);
    
    if (!routeData || routeData.length === 0) {
      return res.status(404).json({ error: "No route found for this user" });
    }

    res.status(200).json({
      message: "Fetched user route successfully",
      data: routeData
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});*/

