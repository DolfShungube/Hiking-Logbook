const express= require("express");
const path = require("path");
const dotenv= require('dotenv/config');
const { createClient } = require("@supabase/supabase-js");
const cors = require('cors');

const app=express()
const port= process.env.PORT||8080
app.use(express.json());

const {inviteFriend,acceptInvite,rejectInvite,getFriends} = require("./friends/friends.controller")
const {signIn,signInWithGoogle,signUp} = require("./auth/auth.controller")
const {fetchCompletedHikes,fetchCurrentHike, fetchHike}= require("./hikeData/hikes.controller");
const { fetchUser } = require("./users/users.controller");
const { getNotes } = require("./notes/notes.controller");
const { getGoals } = require("./goals/goals.controller");



app.use(cors({ origin: true, credentials: true }));

app.get("/", (req, res) => {
  res.send("Server is running..");
});


const supabaseUrl=process.env.VITE_SUPABASE_URL
const supabasekey=process.env.VITE_SUPABASE_ANON_KEY

const supabase= createClient(supabaseUrl,supabasekey,{
        auth: {
        persistSession: true,
        autoRefreshToken: true,
         }
});


app.get("/get-user",fetchUser);



app.post("/invite-friend",inviteFriend)
app.post("/accept-invite",acceptInvite)
app.post("/reject-invite",rejectInvite)
app.get("/get-friends",getFriends)  // check the controller for this needs t !!!


app.post("/signup", signUp);
app.post("/signin", signIn); 
app.post("/googlesignin",signInWithGoogle); 

app.get("/completed-hikes",fetchCompletedHikes);
app.get("/current-hike",fetchCurrentHike)
app.get("/get-hike",fetchHike)

app.get("/get-notes",getNotes)

app.get("/get-goals",getGoals)


app.post("/newHike",async (req,res)=>{

  const{userid,   
        startdate,           
        location,
        weather,
        elevation,                  
        route,
        status,             
        distance,                    
        hikinggroup,
        difficulty}= req.body

const { data, error } = await supabase
    .from("HikeData")
    .insert([
      {
        userid: userid,              
        startdate: startdate,           
        location: location,
        weather: weather,
        elevation: elevation,                   // in m
        route: route,
        status: status,               //Planned / In Progress / Completed
        distance: distance,                     // in m
        hikinggroup: hikinggroup,
        difficulty: difficulty
      }
    ])

    .select();

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  res.status(200).json({
    message: "successfully created new hike",
    hike:data[0]

  });  

})




app.listen(port, "0.0.0.0", () => {

});

app.get("/hikes", async (req, res) =>{
  const {data, error } = await supabase
  .from("hikingStats")
  .select("*")
    .order("startdate",  { ascending: false});
  
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({
    message: "Fetched all hikes",
    hikes: data
  });
  });

