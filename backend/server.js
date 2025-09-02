const express = require("express");
const path = require("path");
const dotenv = require('dotenv/config');
const { createClient } = require("@supabase/supabase-js");
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());

const weatherRouter = require("./endpoints/weatherAPI.js");
const { inviteFriend, acceptInvite, rejectInvite, getFriends } = require("./friends/friends.controller");
const { signIn, signInWithGoogle, signUp } = require("./auth/auth.controller");
const { fetchCompletedHikes, fetchCurrentHike } = require("./hikeData/hikes.controller");
const { CreateNewHike } = require("./hikeData/CreateNewHike");

const { fetchHike, fetchPlannedHikes, editPlannedHike, deletePlannedHike } = require("./hikeData/plannedHikes_details.js");
const { fetchUser } = require("./users/users.controller");
const { getNotes } = require("./notes/notes.controller");
const { getGoals } = require("./goals/goals.controller");
const { getRoute } = require("./routes/routes.controller");

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

app.post("/invite-friend", inviteFriend);
app.post("/accept-invite", acceptInvite);
app.post("/reject-invite", rejectInvite);
app.get("/get-friends", getFriends);
app.post("/signup", signUp);
app.post("/signin", signIn);
app.post("/googlesignin", signInWithGoogle);
// Creating new hike
app.post("/newHike", CreateNewHike);

app.get("/completed-hikes", fetchCompletedHikes);
app.get("/current-hike", fetchCurrentHike);
app.get("/get-hike", fetchHike);

app.get("/get-notes", getNotes);
app.get("/get-goals", getGoals);

app.get("/planned-hikes", fetchPlannedHikes);
app.put("/planned-hikes/:hikeId", editPlannedHike);
app.delete("/planned-hikes/:hikeId", deletePlannedHike);

app.get("/get-route",getRoute);

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


//API to handle hikesStatus update
app.put("/HikeStatus", async (req, res) => {
  const { hikeId, status } = req.body;
  const { data, error } = await supabase
    .from("HikeData")
    .update({ status: status })
    .eq("hikeid", hikeId)
    .select();

    if (error) {
    return res.status(400).json({ error: error.message });
  }else{
    res.status(200).json({
      message: "Hike status updated",
      hike: data[0]
    });
  }
});

app.use("/api/weather",weatherRouter);

module.exports = app;


//API to get all hikeId for a specific user to update the status later
app.get("/userHikeId/:userid", async (req, res) =>{
  const { userid } = req.params;
  const {data, error } = await supabase
  .from("HikeData")
  .select("hikeid")
  .eq("userid", userid)
  .is("status", null);
  
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  //console.log("Query result:", data);
  res.status(200).json({
    message: "Fetched all hikes for user",
    hikes:data,
  });
  });

