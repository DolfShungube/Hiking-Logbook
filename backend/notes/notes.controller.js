const { createClient } = require("@supabase/supabase-js");
const supabaseUrl=process.env.VITE_SUPABASE_URL
const supabasekey=process.env.VITE_SUPABASE_ANON_KEY
const supabase= createClient(supabaseUrl,supabasekey,{
        auth: {
        persistSession: true,
        autoRefreshToken: true,
         }
});





const getNotes= async (req,res)=>{
  const {hikeid}= req.query
 
  try {
    const {data: sentData,error:statusError}= await supabase
    .from("hikeNotes")
    .select("*")
    .eq("hikeid",hikeid)


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


const addNotes= async (req, res) =>{
  const {hikeid,text} = req.body;

  try {

    const { data: sentData, error: sentError } = await supabase.rpc("add_hike_note",
        { p_hikeid: hikeid, p_text:text});

    if (sentError) {
      console.error("Error while getting notes:", sentError);
      return res.status(500).json({ error: sentError.message });
    }


    return res.status(200).json({ message: "added new notes successfully", data:sentData });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};


const removeNotes= async (req, res) =>{
  const {hikeid,text,date} = req.body;

  try {

    const { data: sentData, error: sentError } = await supabase.rpc("remove_hike_note",
        { p_hikeid: hikeid, p_text:text,p_date:date});

    if (sentError) {
      console.error("Error while removing note:", sentError);
      return res.status(500).json({ error: sentError.message });
    }


    return res.status(200).json({ message: "note removed successfully", data:sentData });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};





module.exports={
  getNotes,addNotes,removeNotes
}