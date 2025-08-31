const { createClient } = require("@supabase/supabase-js");
const supabaseUrl=process.env.VITE_SUPABASE_URL
const supabasekey=process.env.VITE_SUPABASE_ANON_KEY
const supabase= createClient(supabaseUrl,supabasekey,{
        auth: {
        persistSession: true,
        autoRefreshToken: true,
         }
});





const getGoals= async (req,res)=>{
  const {hikeid}= req.query
  try {
    const {data,error:statusError}= await supabase
    .from("customGoals")
    .select("*")
    .eq("hikeid",hikeid)


    if(statusError){
      console.error("Error while fetching goal data", statusError);
      return res.status(500).json({ error: statusError.message });      
    }

    
    return res.status(200).json({data});    
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Something went wrong" });  
  }

}


module.exports={
  getGoals
}