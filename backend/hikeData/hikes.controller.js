const { createClient } = require("@supabase/supabase-js");
const supabaseUrl=process.env.VITE_SUPABASE_URL
const supabasekey=process.env.VITE_SUPABASE_ANON_KEY
const supabase= createClient(supabaseUrl,supabasekey,{
        auth: {
        persistSession: true,
        autoRefreshToken: true,
         }
});


const fetchCompletedHikes= async (req,res)=>{

  const {userid}= req.query;
  try {

    const { data: sentData, error: sentError } = await supabase
        .from("HikeData")
        .select("*")
        .eq("userid",userid)
        .eq("status","complete")

    if (sentError) {
      console.error("Error while fetching completed hikes:", sentError);
      return res.status(500).json({ error: sentError.message });
    }

    return res.status(200).json({ message: "completed hikes fetched successfully", data:sentData });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }

}


const fetchCurrentHike= async (req,res)=>{

  const {userid}= req.query;
  try {

    const { data: sentData, error: sentError } = await supabase
        .from("HikeData")
        .select("*")
        .eq("userid",userid)
        .eq("status","in progress")
        

    if (sentError) {
      console.error("Error while fetching the hike:", sentError);
      return res.status(500).json({ error: sentError.message });
    }

    return res.status(200).json({ message: "current hike fetched successfully", data: sentData });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }

}


module.exports={
    fetchCompletedHikes,fetchCurrentHike
}