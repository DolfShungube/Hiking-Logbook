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
  const {hikeid,userid}= req.query
  try {
    const {data,error:statusError}= await supabase
    .from("customGoals")
    .select("*")
    .eq("hikeid",hikeid)
    .eq("userid",userid)



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

const addGoal= async (req, res) =>{
  const {hikeid,goalDiscription,goalStatus,userid} = req.body;

  try {

    const { data: sentData, error: sentError } = await supabase.rpc("add_custom_goal",
        { hike_id: hikeid, goal_description:goalDiscription, goal_status:goalStatus,p_user:userid });

    if (sentError) {
      console.error("Error while getting goal:", sentError);
      return res.status(500).json({ error: sentError.message });
    }


    return res.status(200).json({ message: "added new goal successfully", data:sentData });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};


const updateGoalStatus= async (req, res) => {
  const {hikeid,goalDiscription,goalStatus,userid} = req.body;

  try {

    const { data: sentData, error: sentError } = await supabase.rpc("update_goal_status",
        { hike_id: hikeid, goal_description:goalDiscription, new_status:goalStatus,p_user:userid });

    if (sentError) {
      console.error("Error while updating status:", sentError);
      return res.status(500).json({ error: sentError.message });
    }


    return res.status(200).json({ message: "status updated successfully", data:sentData });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};


const removeGoal= async (req, res) => {
  const { hikeid, goalDescription,userid } = req.body;

  try {

    const { data: sentData, error: sentError } = await supabase.rpc("remove_goal",
        { hike_id: hikeid, goal_description:goalDescription,p_user:userid});

    if (sentError) {
      console.error("Error while removing goal:", sentError);
      return res.status(500).json({ error: sentError.message });
    }


    return res.status(200).json({ message: "goal removed successfully", data:sentData });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};




module.exports={
  getGoals,addGoal,updateGoalStatus,removeGoal
}