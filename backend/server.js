const express= require("express");
const path = require("path");
const dotenv= require('dotenv/config');
const { createClient } = require("@supabase/supabase-js");


const app=express()
const port= process.env.PORT||8080
app.use(express.json());

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




app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        firstname: firstName,
        lastname: lastName,
      },
    },
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({ user: data.user });
});



app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  res.cookie("sb-access-token", data.session.access_token, {
    httpOnly: true, 
   // secure: true,  
    sameSite: "Strict",
    maxAge: 60*60*1000
  });

  res.status(200).json({
    message: "Login successful",
    user: data.user
  });
}); 


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
