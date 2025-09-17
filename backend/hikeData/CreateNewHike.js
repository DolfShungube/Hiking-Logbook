const { createClient } = require("@supabase/supabase-js");
const supabaseUrl=process.env.VITE_SUPABASE_URL
const supabasekey=process.env.VITE_SUPABASE_ANON_KEY
const supabase= createClient(supabaseUrl,supabasekey,{
        auth: {
        persistSession: true,
        autoRefreshToken: true,
         }
});
exports.supabase = supabase;
const CreateNewHike = async (req,res)=> {
  console.log('Creating hike with data:', req.body);
  const {userid,   
        startdate,           
        location,
        weather,
        elevation,                  
        route,
        status,             
        distance,                    
        hikinggroup,
        difficulty} = req.query;
  try{
    const {data ,error } = await supabase
              .from("HikeData")
              .insert([{ 
                userid: req.body.userid,
      startdate: req.body.startdate,
      enddate: req.body.enddate,
      location: req.body.location,
      weather: req.body.weather,  // You might store as JSON if your DB supports it
      elevation: parseFloat(req.body.elevation.replace(/[^\d.-]/g, '')), // "3,200 ft" → 3200
      status: req.body.status,
      distance: parseFloat(req.body.distance.replace(/[^\d.-]/g, '')),  // "12.2 miles" → 12.2
      hikinggroup: req.body.hikinggroup,
      difficulty: req.body.difficulty,
      title: String(req.body.title), // Explicitly convert to string
      route: req.body.route
               }])
              .select();
    if (error) {
    return res.status(401).json({ error: error.message });
           }

      res.status(200).json({
         message: "successfully created new hike",
      hike:data[0]

  }); 

          }catch (err) {
        return res.status(500).json({ error: err.message });
    }

};





module.exports={
    CreateNewHike
}