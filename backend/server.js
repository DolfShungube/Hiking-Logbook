const express= require("express");
const path = require("path");
//const { createClient } = require("@supabase/supabase-js");


const app=express()
const port= process.env.PORT||8080
app.use(express.json());

app.get("/api", (req, res) => {
  res.send("Server is running..");
});



app.use(express.static(path.join(__dirname,"frontend/dist")));


app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname,"frontend/dist/index.html"));
});




app.listen(port, "0.0.0.0", () => {
  //console.log(`Server is running at http://localhost:${port}`);
});


// const supabase= createClient(process.env.VITE_SUPABASE_URL,process.env.VITE_SUPABASE_KEY,{
//         auth: {
//         persistSession: true,
//         autoRefreshToken: true,
//          }
// });




// app.post("/signup", async (req, res) => {
//   const { firstName, lastName, email, password } = req.body;

//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password,
//     options: {
//       data: {
//         firstname: firstName,
//         lastname: lastName,
//       },
//     },
//   });

//   if (error) {
//     return res.status(400).json({ error: error.message });
//   }

//   res.status(200).json({ user: data.user });
// });



// app.post("/signin", async (req, res) => {
//   const { email, password } = req.body;

//   const { data, error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   });

//   if (error) {
//     return res.status(401).json({ error: error.message });
//   }

//   res.cookie("sb-access-token", data.session.access_token, {
//     httpOnly: true, 
//    // secure: true,  
//     sameSite: "Strict",
//     maxAge: 60*60*1000
//   });

//   res.status(200).json({
//     message: "Login successful",
//     user: data.user
//   });
// });  



