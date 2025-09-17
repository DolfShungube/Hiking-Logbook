const { createClient } = require("@supabase/supabase-js");
const supabaseUrl=process.env.VITE_SUPABASE_URL
const supabasekey=process.env.VITE_SUPABASE_ANON_KEY
const supabase= createClient(supabaseUrl,supabasekey,{
        auth: {
        persistSession: true,
        autoRefreshToken: true,
         }
});



const fetchUser= async (req, res) => {
  const {  userid} = req.query;

  try {

    const { data: sentData, error: sentError } = await supabase.rpc("get_user",
        { user_id: userid});

    if (sentError) {
      console.error("Error while getting user:", sentError);
      return res.status(500).json({ error: sentError.message });
    }


    return res.status(200).json({ message: "user fetched successfully", data:sentData });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};


const getUserByName= async (req,res)=>{
  const {userName}= req.query
  try {
    const {data,error:statusError}= await supabase
    .from("user_display")
    .select("id")
    .ilike("display_name", `%${userName}%`);

    if(statusError){
      console.error("Error while fetching friend data", statusError);
      return res.status(500).json({ error: statusError.message });      
    }

    
    return res.status(200).json({ data});    
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Something went wrong" });  
  }
}

module.exports={
 fetchUser,getUserByName
}