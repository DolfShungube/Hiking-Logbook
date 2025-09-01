const { createClient } = require("@supabase/supabase-js");
const supabaseUrl=process.env.VITE_SUPABASE_URL
const supabasekey=process.env.VITE_SUPABASE_ANON_KEY
const supabase= createClient(supabaseUrl,supabasekey,{
        auth: {
        persistSession: true,
        autoRefreshToken: true,
         }
});





const getRoute= async (req,res)=>{
  const {routeid}= req.query
 
  try {
    const {data: sentData,error:statusError}= await supabase
    .from("routes")
    .select("*")
    .eq("routeid",routeid)


    if(statusError){
      console.error("Error while fetching notes data", statusError);
      return res.status(500).json({ error: statusError.message });      
    }

    
    return res.status(200).json({data: sentData});    
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Something went wrong" });  
  }

}


module.exports={
  getRoute
}