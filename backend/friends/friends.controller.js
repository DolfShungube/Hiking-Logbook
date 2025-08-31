const { createClient } = require("@supabase/supabase-js");
const supabaseUrl=process.env.VITE_SUPABASE_URL
const supabasekey=process.env.VITE_SUPABASE_ANON_KEY
const supabase= createClient(supabaseUrl,supabasekey,{
        auth: {
        persistSession: true,
        autoRefreshToken: true,
         }
});




const inviteFriend= async (req, res) => {
  const {  userid, friendid} = req.body;

  try {

    const { data: sentData, error: sentError } = await supabase.rpc("friend_invite",
        { user_id: userid, friend_id: friendid });

    if (sentError) {
      console.error("Error while sending invite:", sentError);
      return res.status(500).json({ error: sentError.message });
    }

    const { data: receivedData, error: receivedError } = await supabase.rpc(
      "friend_invite_received",
      { user_id: friendid, friend_id: userid }
    );

    if (receivedError) {
      console.error("Error in  receiving the invite:", receivedError);
      return res.status(500).json({ error: receivedError.message });
    }

    return res.status(200).json({ message: "Friend invite sent successfully" });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};


const acceptInvite= async (req, res) => {
  const {  userid, friendid} = req.body;

  try {

    const { data: sentData, error: updateError } = await supabase.rpc("accept_invite",
        { user_id: userid, friend_id: friendid });

    if (updateError) {
      console.error("Error while updating status:", updateError);
      return res.status(500).json({ error: updateError.message });
    }

    const { data: FriendData, error: statusError } = await supabase.rpc("accept_invite",
        { user_id: friendid, friend_id: userid});

    if (statusError) {
      console.error("Error while updating status of the friend requestor:", statusError);
      return res.status(500).json({ error: statusError.message });
    }    

    return res.status(200).json({ message: "Friend accepted successfully" });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}; 



const rejectInvite= async (req, res) => {
  const {  userid, friendid} = req.body;

  try {

    const { data: sentData, error: updateError } = await supabase.rpc("reject_invite",
        { user_id: userid, friend_id: friendid });

    if (updateError) {
      console.error("Error while updating status:", updateError);
      return res.status(500).json({ error: updateError.message });
    }

    const { data: FriendData, error: statusError } = await supabase.rpc("reject_invite",
        { user_id: friendid, friend_id: userid});

    if (statusError) {
      console.error("Error while updating status of the friend requestor:", statusError);
      return res.status(500).json({ error: statusError.message });
    }    

    return res.status(200).json({ message: "Friend rejected successfully" });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};


const getFriends= async (req,res)=>{
  const {userid}= req.query
  try {
    const {data,error:statusError}= await supabase
    .from("friends")
    .select("*")
    .eq("userid",userid)
    .single()

    if(statusError){
      console.error("Error while fetching friend data", statusError);
      return res.status(500).json({ error: statusError.message });      
    }

    const friend_list = data?.friendlist ?? {friends: [],invitessent: [],invitesreceived: []};
    return res.status(200).json({ friend_list});    
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Something went wrong" });  
  }

}


module.exports={
  inviteFriend,acceptInvite,rejectInvite,getFriends
}


